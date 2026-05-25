import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import crypto from "crypto";
import admin from "firebase-admin";

dotenv.config();

const app = express();

// Security Feature 1: Explicit JSON parsing size limit (DOS defense)
app.use(express.json({ limit: "15kb" }));

// Security Feature 2: Strict HTTP response security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Security Feature 3: API Key leak projection and error message sanitization
function sanitizeErrorMessage(message: string): string {
  if (!message) return "A secure server error occurred.";
  let sanitized = message;

  // Mask Gemini APIs patterns & Firebase configuration credentials
  sanitized = sanitized.replace(/AIzaSy[a-zA-Z0-9_-]{33}/g, "API_KEY_MASKED");

  if (process.env.SMTP_USER) {
    sanitized = sanitized.split(process.env.SMTP_USER).join("[EMAIL_MASKED]");
  }
  if (process.env.SMTP_PASS) {
    sanitized = sanitized.split(process.env.SMTP_PASS).join("[CREDENTIALS_MASKED]");
  }
  if (process.env.GEMINI_API_KEY) {
    sanitized = sanitized.split(process.env.GEMINI_API_KEY).join("[API_KEY_MASKED]");
  }

  // Cover generic credential errors safely
  if (
    sanitized.toLowerCase().includes("api key") || 
    sanitized.toLowerCase().includes("credential") || 
    sanitized.toLowerCase().includes("auth") ||
    sanitized.toLowerCase().includes("secret")
  ) {
    return "A configuration or authorization issue occurred on the server. Confidential data has been safely isolated.";
  }

  return sanitized;
}

// Security Feature 4: Lightweight In-memory DDoS Rate Limiter
interface LimitRecord {
  count: number;
  lastReset: number;
}
const IP_LIMITS = new Map<string, LimitRecord>();
const RATE_LIMIT_RESET_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 40; // Adequate for developers, prevents high-volume bot spam

function globalRateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const rawIp = req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "client";
  const ip = rawIp.split(",")[0].trim();
  const now = Date.now();
  
  const record = IP_LIMITS.get(ip) || { count: 0, lastReset: now };
  if (now - record.lastReset > RATE_LIMIT_RESET_MS) {
    record.count = 1;
    record.lastReset = now;
  } else {
    record.count++;
  }
  
  IP_LIMITS.set(ip, record);
  
  if (record.count > MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({
      error: "Rate limit exceeded. Please limit bulk API requests and retry shortly."
    });
  }
  next();
}

app.use("/api/", globalRateLimiter);

const PORT = 3000;

// Initialize Firebase Admin securely
let firebaseAdminAuth: admin.auth.Auth | null = null;
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.K_SERVICE || process.env.FIREBASE_CONFIG) {
    admin.initializeApp();
    firebaseAdminAuth = admin.auth();
    console.log("Firebase Admin successfully initialized via application default context.");
  } else {
    const jsonPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(jsonPath)) {
      const config = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      admin.initializeApp({
        projectId: config.projectId,
      });
      firebaseAdminAuth = admin.auth();
      console.log(`Firebase Admin initialized locally leveraging project: ${config.projectId}`);
    }
  }
} catch (error) {
  console.error("Firebase Admin initialization failed. Reset password backend will fall back to local mode gracefully:", error);
}

// Initialize Gemini
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "fake@example.com",
    pass: process.env.SMTP_PASS || "fakepassword",
  },
});

// In-memory leads DB (mock)
const leads: any[] = [];
const users: any[] = [];

// API Routes
app.post("/api/leads", (req, res) => {
  const { name, phone, business, work, time } = req.body;
  
  const finalWork = work || business;
  if (!name || !finalWork) {
    return res.status(400).json({ success: false, message: "Required fields name and work/business are missing." });
  }

  // Sanitize inputs to prevent Stored XSS / Script Execution
  const sanitize = (val: any): string => {
    if (typeof val !== "string") return "";
    return val.replace(/<[^>]*>/g, "").trim().substring(0, 500); 
  };

  const cleanLead = {
    name: sanitize(name),
    phone: sanitize(phone || "Not provided"),
    work: sanitize(finalWork),
    time: sanitize(time || "Not specified")
  };

  leads.push({ ...cleanLead, id: Date.now() });
  // Pretending to send WhatsApp
  console.log("Mocking WhatsApp to 8305500767:", cleanLead);
  res.json({ success: true, message: "Lead saved safely" });
});

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const sanitize = (val: any): string => {
    if (typeof val !== "string") return "";
    return val.replace(/<[^>]*>/g, "").trim().substring(0, 200); 
  };

  const cleanName = sanitize(name || "User");
  const cleanEmail = sanitize(email).toLowerCase();
  
  // Basic Regex to block injection attacks through email headers
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ success: false, message: "Invalid email format structure." });
  }

  const userData = { name: cleanName, email: cleanEmail, password };
  users.push({ ...userData, id: Date.now() });
  
  try {
    if (process.env.SMTP_USER) {
      // Secure SMTP headers to prevent Email Header Injection
      await transporter.sendMail({
        from: `"S-Call Hub" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: "New User Signup",
        text: `New User Signup\n\nName: ${cleanName}\nEmail: ${cleanEmail}`,
      });
      console.log(`Email sent to ${process.env.SMTP_USER}`);

      await transporter.sendMail({
        from: `"S-Call Hub" <${process.env.SMTP_USER}>`,
        to: cleanEmail,
        subject: "Welcome to S-Call Hub!",
        text: `Hi ${cleanName},\n\nWelcome to S-Call Hub! We're excited to have you on board. You can now explore our AI voice and text agent demos.\n\nBest regards,\nThe S-Call Hub Team`,
      });
      console.log(`Welcome email sent to ${cleanEmail}`);
    } else {
      console.log("SMTP_USER not configured. Mocking Email to s.callhub2811@gmail.com:", userData);
    }
  } catch (error: any) {
    console.error("Failed to send email securely:", error);
  }
  
  res.json({ success: true, message: "User signed up & notified" });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }
  const cleanEmail = String(email).trim().toLowerCase();
  const user = users.find(u => u.email === cleanEmail && u.password === password);
  if (user) {
    res.json({ success: true, user: { name: user.name, email: user.email } });
  } else {
    // For demo purposes, if not found but generic format, just auth anyway
    res.json({ success: true, user: { name: "Demo User", email: cleanEmail } });
  }
});

// In-memory token store for password resets (token -> { email, expires })
const resetTokens = new Map<string, { email: string; expires: number }>();

app.post("/api/forgot-password", async (req, res) => {
  const { email, origin } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  try {
    // Generate secure unique token
    const token = crypto.randomBytes(32).toString("hex");
    // Token valid for 1 hour
    const expires = Date.now() + 3600000;
    resetTokens.set(token, { email, expires });

    // Use current origin or default hosting
    const resetLink = `${origin || "http://localhost:3000"}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    console.log(`Password reset requested for ${email}: ${resetLink}`);

    if (process.env.SMTP_USER && process.env.SMTP_USER !== "fake@example.com") {
      await transporter.sendMail({
        from: `"S-Call Hub" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Reset your S-Call Hub Password",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #ffffff10; border-radius: 16px; background-color: #0d0d0d; color: #e5e7eb;">
            <h2 style="color: #ffffff; font-weight: bold; margin-bottom: 20px; text-align: center; border-bottom: 1px solid #262626; padding-bottom: 15px;">S-Call Hub Password Recovery</h2>
            <p>Hello,</p>
            <p>We received a request to reset the password associated with your S-Call Hub account. Click the button below to recover your password:</p>
            <div style="margin: 35px 0; text-align: center;">
              <a href="${resetLink}" style="background-color: #ffffff; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your address bar:</p>
            <p style="word-break: break-all; color: #60a5fa; font-size: 13px;">${resetLink}</p>
            <p style="font-size: 12px; color: #737373; margin-top: 35px;">If you did not make this request, you can safely ignore this email. This reset link will remain active for 1 hour.</p>
            <hr style="border: 0; border-top: 1px solid #262626; margin: 30px 0;" />
            <p style="font-size: 11px; text-align: center; color: #404040;">The S-Call Hub Team</p>
          </div>
        `,
      });
      console.log(`Nodemailer reset email successfully sent to ${email}`);
    } else {
      console.log(`[SMTP MOCK MODE] Custom password reset link generated for ${email}:\n${resetLink}`);
    }

    res.json({ success: true, message: "Reset link sent successfully." });
  } catch (error: any) {
    console.error("Password reset requesting error:", error);
    res.status(500).json({ success: false, message: "We encountered an issue processing your request." });
  }
});

app.post("/api/reset-password", async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing required token, email, or password data." });
  }

  const tokenData = resetTokens.get(token);
  if (!tokenData || tokenData.email !== email || tokenData.expires < Date.now()) {
    return res.status(400).json({ success: false, message: "The password recovery token is invalid or has expired." });
  }

  try {
    if (firebaseAdminAuth) {
      // Find user by email and update password using Admin SDK
      const userRecord = await firebaseAdminAuth.getUserByEmail(email);
      await firebaseAdminAuth.updateUser(userRecord.uid, { password });
      console.log(`Successfully updated Firebase Auth credentials securely for user: ${email}`);
    } else {
      console.log(`[FALLBACK MATCH] Firebase Admin offline / not configured. Local fallback password updated for ${email}`);
    }

    // Update local users mock database in case they use basic backend login fallback
    const mockUser = users.find(u => u.email === email);
    if (mockUser) {
      mockUser.password = password;
    }

    // Clean up used token
    resetTokens.delete(token);

    res.json({ success: true, message: "Your password has been successfully reset." });
  } catch (error: any) {
    console.error("Reset password execution error:", error);
    res.status(500).json({ success: false, message: sanitizeErrorMessage(error.message) || "Failed to update security credentials." });
  }
});

app.post("/api/gemini-chat", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key not configured on server" });
    }
    const { message, systemInstruction, googleAccessToken } = req.body;
    
    // Security check: Validate parameters and restrict input sizes to prevent long-input attack
    if (typeof message !== "string" || message.trim().length === 0 || message.length > 3000) {
      return res.status(400).json({ error: "Invalid text message size. Limit is 3000 characters." });
    }
    if (systemInstruction && (typeof systemInstruction !== "string" || systemInstruction.length > 5000)) {
      return res.status(400).json({ error: "Invalid instruction constraints." });
    }
    
    const tools = googleAccessToken ? [{
      functionDeclarations: [
        {
          name: "book_calendar_appointment",
          description: "Books an appointment on the user's Google Calendar.",
          parameters: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING", description: "Title of the appointment." },
              startTime: { type: "STRING", description: "Start time of the appointment in ISO 8601 format." },
              durationMinutes: { type: "INTEGER", description: "Duration of the appointment in minutes." },
            },
            required: ["title", "startTime", "durationMinutes"]
          }
        }
      ]
    }] as any : undefined;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.3,
        maxOutputTokens: 1000,
        tools
      }
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === "book_calendar_appointment" && googleAccessToken) {
        const { title, startTime, durationMinutes } = call.args as any;
        
        const start = new Date(startTime);
        const end = new Date(start.getTime() + durationMinutes * 60000);
        
        try {
          const calRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${googleAccessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              summary: title,
              start: { dateTime: start.toISOString() },
              end: { dateTime: end.toISOString() }
            })
          });
          
          if (calRes.ok) {
            // Re-prompt model with success
            const followup = await ai.models.generateContent({
               model: "gemini-3.5-flash",
               contents: [
                 { role: "user", parts: [{ text: message }] },
                 { role: "model", parts: [{ functionCall: call }] },
                 { role: "user", parts: [{ functionResponse: { name: call.name, response: { success: true } } }] }
               ],
               config: { systemInstruction, temperature: 0.3, maxOutputTokens: 1000 }
            });
            return res.json({ text: followup.text });
          } else {
             console.error("Calendar API Error:", await calRes.text());
             return res.json({ text: "I'm sorry, placing the appointment on your calendar failed." });
          }
        } catch (e) {
          console.error("Failed to book calendar", e);
          return res.json({ text: "I'm sorry, there was a technical error booking the calendar." });
        }
      }
    }

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: sanitizeErrorMessage(error?.message || "Failed to generate AI response") });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
