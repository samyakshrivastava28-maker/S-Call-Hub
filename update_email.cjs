const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf-8');

// Update function signature
code = code.replace(
  'async function sendEmailJs(template_id: string, to_email: string, subject: string, message: string, html_message: string = "", reset_link: string = "", use_second_account: boolean = false) {',
  'async function sendEmailJs(template_id: string, to_email: string, subject: string, message: string, html_message: string = "", reset_link: string = "", use_second_account: boolean = false, user_name: string = "", user_email: string = "") {'
);

// Update emailjs.send payload
code = code.replace(
  `      {
        to_email,
        subject,
        message,
        html_message: html_message || message,
        reset_link: reset_link
      }`,
  `      {
        to_email,
        subject,
        message,
        html_message: html_message || message,
        reset_link: reset_link,
        user_name: user_name || to_email,
        user_email: user_email || to_email,
        name: user_name || to_email,
        email: user_email || to_email
      }`
);

// Update calls to pass name and email
code = code.replace(
  /await sendEmailJs\(process\.env\.EMAILJS_TEMPLATE_WELCOME \|\| "", cleanEmail, "Welcome to S-Call Hub!", `Hi \$\{cleanName\},\\n\\nWelcome to S-Call Hub! We're excited to have you on board\. You can now explore our AI voice and text agents\.\\n\\nBest regards,\\nThe S-Call Hub Team`\);/,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_WELCOME || "", cleanEmail, "Welcome to S-Call Hub!", `Hi ${cleanName},\\n\\nWelcome to S-Call Hub! We\\'re excited to have you on board. You can now explore our AI voice and text agents.\\n\\nBest regards,\\nThe S-Call Hub Team`, "", "", false, cleanName, cleanEmail);'
);

code = code.replace(
  /await sendEmailJs\(process\.env\.EMAILJS_TEMPLATE_ADMIN_SIGNUP \|\| "", adminEmail, "New User Signup", `New User Signup\\n\\nName: \$\{cleanName\}\\nEmail: \$\{cleanEmail\}`\);/,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_ADMIN_SIGNUP || "", adminEmail, "New User Signup", `New User Signup\\n\\nName: ${cleanName}\\nEmail: ${cleanEmail}`, "", "", false, cleanName, cleanEmail);'
);

code = code.replace(
  /await sendEmailJs\(process\.env\.EMAILJS_TEMPLATE_WELCOME_BACK \|\| "", cleanEmail, "Welcome back to S-Call Hub!", `Hi \$\{user\.name\},\\n\\nWelcome back to S-Call Hub! We're glad to see you again\.\\n\\nBest regards,\\nThe S-Call Hub Team`, "", "", true\);/,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_WELCOME_BACK || "", cleanEmail, "Welcome back to S-Call Hub!", `Hi ${user.name},\\n\\nWelcome back to S-Call Hub! We\\'re glad to see you again.\\n\\nBest regards,\\nThe S-Call Hub Team`, "", "", true, user.name, cleanEmail);'
);

code = code.replace(
  /await sendEmailJs\(process\.env\.EMAILJS_TEMPLATE_ADMIN_LOGIN \|\| "", adminEmail, "User Login Notification", `User Login Notification\\n\\nName: \$\{user\.name\}\\nEmail: \$\{cleanEmail\}`, "", "", true\);/,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_ADMIN_LOGIN || "", adminEmail, "User Login Notification", `User Login Notification\\n\\nName: ${user.name}\\nEmail: ${cleanEmail}`, "", "", true, user.name, cleanEmail);'
);

fs.writeFileSync('server.ts', code, 'utf-8');
console.log("Replaced");
