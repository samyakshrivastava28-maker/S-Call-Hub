const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

// Replace sendEmailJs definition
code = code.replace(
  /async function sendEmailJs\(to_email: string, subject: string, message: string, html_message: string = "", reset_link: string = ""\) \{/,
  'async function sendEmailJs(template_id: string, to_email: string, subject: string, message: string, html_message: string = "", reset_link: string = "") {'
);

code = code.replace(
  /if \(\!process\.env\.EMAILJS_SERVICE_ID \|\| \!process\.env\.EMAILJS_TEMPLATE_ID \|\| \!process\.env\.EMAILJS_PUBLIC_KEY\) \{/,
  'if (!process.env.EMAILJS_SERVICE_ID || !template_id || !process.env.EMAILJS_PUBLIC_KEY) {'
);

code = code.replace(
  /process\.env\.EMAILJS_TEMPLATE_ID,/,
  'template_id,'
);

// Add default fallbacks for template IDs to avoid compile errors if missing, 
// using "template_xyzz" as defaults so it doesn't crash but they are clearly placeholders.
code = code.replace(
  /await sendEmailJs\(process\.env\.SMTP_USER \|\| "admin@example\.com", "New Business Lead"/,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_LEAD || "", process.env.SMTP_USER || "admin@example.com", "New Business Lead"'
);

code = code.replace(
  /await sendEmailJs\(process\.env\.SMTP_USER \|\| "admin@example\.com", "New User Signup"/,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_ADMIN_SIGNUP || "", process.env.SMTP_USER || "admin@example.com", "New User Signup"'
);

code = code.replace(
  /await sendEmailJs\(cleanEmail, "Welcome to S-Call Hub!", `Hi \$\{cleanName\},\n\nWelcome to S-Call Hub!/,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_WELCOME || "", cleanEmail, "Welcome to S-Call Hub!", `Hi ${cleanName},\\n\\nWelcome to S-Call Hub!'
);

code = code.replace(
  /await sendEmailJs\(cleanEmail, "Welcome back to S-Call Hub!", `Hi \$\{user\.name\},\n\nWelcome back/,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_WELCOME_BACK || "", cleanEmail, "Welcome back to S-Call Hub!", `Hi ${user.name},\\n\\nWelcome back'
);

code = code.replace(
  /await sendEmailJs\(process\.env\.SMTP_USER \|\| "admin@example\.com", "User Login Notification", `User Login Notification\\n\\nName: \$\{user\.name\}\\nEmail: \$\{cleanEmail\}`\);/,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_ADMIN_LOGIN || "", process.env.SMTP_USER || "admin@example.com", "User Login Notification", `User Login Notification\\n\\nName: ${user.name}\\nEmail: ${cleanEmail}`);'
);


code = code.replace(
  /await sendEmailJs\(cleanEmail, "Welcome back to S-Call Hub!", `Hi there,\n\nWelcome back to/,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_WELCOME_BACK || "", cleanEmail, "Welcome back to S-Call Hub!", `Hi there,\\n\\nWelcome back to'
);

code = code.replace(
  /await sendEmailJs\(process\.env\.SMTP_USER \|\| "admin@example\.com", "User Login Notification", `User Login Notification\\n\\nEmail: \$\{cleanEmail\}`\);/,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_ADMIN_LOGIN || "", process.env.SMTP_USER || "admin@example.com", "User Login Notification", `User Login Notification\\n\\nEmail: ${cleanEmail}`);'
);

code = code.replace(
  /await sendEmailJs\(\s+email,\s+"Reset your S-Call Hub Password",/,
  'await sendEmailJs(\n        process.env.EMAILJS_TEMPLATE_RESET || "",\n        email, \n        "Reset your S-Call Hub Password",'
);


fs.writeFileSync('server.ts', code);
