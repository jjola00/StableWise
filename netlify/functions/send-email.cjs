const nodemailer = require("nodemailer");

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "*")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const pickOrigin = (reqOrigin) => {
  if (allowedOrigins.includes("*")) return "*";
  return allowedOrigins.includes(reqOrigin) ? reqOrigin : allowedOrigins[0] || "*";
};

const cors = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});

exports.handler = async (event) => {
  const origin = pickOrigin(event.headers.origin || "");

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: cors(origin), body: "ok" };
  }

  try {
    const {
      toEmail,
      fromName,
      fromEmail,
      phone,
      message,      
      subject,        
      replyTo       
    } = JSON.parse(event.body || "{}");

    if (!toEmail || !fromName || !fromEmail || !message) {
      return {
        statusCode: 400,
        headers: cors(origin),
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST,           
      port: Number(process.env.ZOHO_SMTP_PORT),   
      secure: String(process.env.ZOHO_SMTP_PORT) === "465",
      auth: {
        user: process.env.ZOHO_SMTP_USER,         
        pass: process.env.ZOHO_SMTP_PASS,
      },
    });

    const fromAddress  = process.env.ZOHO_FROM_EMAIL || process.env.ZOHO_SMTP_USER;
    const mailSubject  = subject || `New message from ${fromName} via StableWise`;
    const mailReplyTo  = replyTo || `${fromName} <${fromEmail}>`;

    const info = await transporter.sendMail({
      from: `StableWise <${fromAddress}>`,
      to: toEmail,
      subject: mailSubject,
      html: message,                               
      replyTo: mailReplyTo,
    });

    return {
      statusCode: 200,
      headers: { ...cors(origin), "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, id: info.messageId }),
    };
  } catch (err) {
    console.error("Zoho SMTP error:", err);
    return {
      statusCode: 500,
      headers: cors(origin),
      body: JSON.stringify({ error: "Email send failed" }),
    };
  }
};
