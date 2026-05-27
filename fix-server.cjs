const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The remaining cleanEmail calls
code = code.replace(
  /await sendEmailJs\(cleanEmail, "Welcome to S-Call Hub!", `Hi \$\{cleanName\},\\n\\nWelcome to S-Call Hub! We're excited to have you on board\. You can now explore our AI voice and text agents\.\\n\\nBest regards,\\nThe S-Call Hub Team`\);/g,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_WELCOME || "", cleanEmail, "Welcome to S-Call Hub!", `Hi ${cleanName},\\n\\nWelcome to S-Call Hub! We\\'re excited to have you on board. You can now explore our AI voice and text agents.\\n\\nBest regards,\\nThe S-Call Hub Team`);'
);

code = code.replace(
  /await sendEmailJs\(cleanEmail, "Welcome back to S-Call Hub!", `Hi \$\{user\.name\},\\n\\nWelcome back to S-Call Hub! We're glad to see you again\.\\n\\nBest regards,\\nThe S-Call Hub Team`\);/g,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_WELCOME_BACK || "", cleanEmail, "Welcome back to S-Call Hub!", `Hi ${user.name},\\n\\nWelcome back to S-Call Hub! We\\'re glad to see you again.\\n\\nBest regards,\\nThe S-Call Hub Team`, "", "", true);'
);

code = code.replace(
  /await sendEmailJs\(cleanEmail, "Welcome back to S-Call Hub!", `Hi there,\\n\\nWelcome back to S-Call Hub! We're glad to see you again\.\\n\\nBest regards,\\nThe S-Call Hub Team`\);/g,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_WELCOME_BACK || "", cleanEmail, "Welcome back to S-Call Hub!", `Hi there,\\n\\nWelcome back to S-Call Hub! We\\'re glad to see you again.\\n\\nBest regards,\\nThe S-Call Hub Team`, "", "", true);'
);

// We need to add the 7th param to sendEmailJs wrapper
code = code.replace(
  /async function sendEmailJs\(template_id: string, to_email: string, subject: string, message: string, html_message: string = "", reset_link: string = ""\) \{/,
  'async function sendEmailJs(template_id: string, to_email: string, subject: string, message: string, html_message: string = "", reset_link: string = "", use_second_account: boolean = false) {'
);

code = code.replace(
  /if \(\!process\.env\.EMAILJS_SERVICE_ID \|\| \!template_id \|\| \!process\.env\.EMAILJS_PUBLIC_KEY\) \{/,
  `const service_id = use_second_account && process.env.EMAILJS_SERVICE_ID_2 ? process.env.EMAILJS_SERVICE_ID_2 : process.env.EMAILJS_SERVICE_ID;
  const public_key = use_second_account && process.env.EMAILJS_PUBLIC_KEY_2 ? process.env.EMAILJS_PUBLIC_KEY_2 : process.env.EMAILJS_PUBLIC_KEY;
  const private_key = use_second_account && process.env.EMAILJS_PRIVATE_KEY_2 ? process.env.EMAILJS_PRIVATE_KEY_2 : process.env.EMAILJS_PRIVATE_KEY;

  if (!service_id || !template_id || !public_key) {`
);

code = code.replace(
  /await emailjs\.send\(\s*process\.env\.EMAILJS_SERVICE_ID,/,
  'await emailjs.send(\n      service_id,'
);
code = code.replace(
  /publicKey: process\.env\.EMAILJS_PUBLIC_KEY,/,
  'publicKey: public_key,'
);
code = code.replace(
  /privateKey: process\.env\.EMAILJS_PRIVATE_KEY,/,
  'privateKey: private_key,'
);

// Since LOGIN admin needs second account as well
code = code.replace(
  /await sendEmailJs\(process\.env\.EMAILJS_TEMPLATE_ADMIN_LOGIN \|\| "", process\.env\.SMTP_USER \|\| "admin@example\.com", "User Login Notification", `User Login Notification\\n\\nName: \$\{user\.name\}\\nEmail: \$\{cleanEmail\}`\);/g,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_ADMIN_LOGIN || "", process.env.SMTP_USER || "admin@example.com", "User Login Notification", `User Login Notification\\n\\nName: ${user.name}\\nEmail: ${cleanEmail}`, "", "", true);'
);

code = code.replace(
  /await sendEmailJs\(process\.env\.EMAILJS_TEMPLATE_ADMIN_LOGIN \|\| "", process\.env\.SMTP_USER \|\| "admin@example\.com", "User Login Notification", `User Login Notification\\n\\nEmail: \$\{cleanEmail\}`\);/g,
  'await sendEmailJs(process.env.EMAILJS_TEMPLATE_ADMIN_LOGIN || "", process.env.SMTP_USER || "admin@example.com", "User Login Notification", `User Login Notification\\n\\nEmail: ${cleanEmail}`, "", "", true);'
);


fs.writeFileSync('server.ts', code);
