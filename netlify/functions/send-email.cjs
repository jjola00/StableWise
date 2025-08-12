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
    const { toEmail, fromName, fromEmail, phone, message } = JSON.parse(event.body || "{}");
    if (!toEmail || !fromName || !fromEmail || !message) {
      return {
        statusCode: 400,
        headers: cors(origin),
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST,           // smtp.zoho.eu
      port: Number(process.env.ZOHO_SMTP_PORT),   // 465 or 587
      secure: String(process.env.ZOHO_SMTP_PORT) === "465", // SSL for 465
      auth: {
        user: process.env.ZOHO_SMTP_USER,         // info@stablewise.org
        pass: process.env.ZOHO_SMTP_PASS,         // Zoho app password
      },
    });

    const fromAddress = process.env.ZOHO_FROM_EMAIL || process.env.ZOHO_SMTP_USER;

    const info = await transporter.sendMail({
      from: `StableWise <${fromAddress}>`,
      to: toEmail,
      subject: `New message from ${fromName} via StableWise`,
      html: `
        <p><strong>Name:</strong> ${fromName}</p>
        <p><strong>Email:</strong> ${fromEmail}</p>
        <p><strong>Phone:</strong> ${phone || ""}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
      replyTo: `${fromName} <${fromEmail}>`,
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
