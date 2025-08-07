import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { toEmail, fromName, fromEmail, phone, message } = await req.json();

  const apiKey = Deno.env.get("RESEND_API_KEY");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "StableWise <info@stablewise.com>",
      to: toEmail,
      subject: `New message from ${fromName} via StableWise`,
      html: `
        <p><strong>Name:</strong> ${fromName}</p>
        <p><strong>Email:</strong> ${fromEmail}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    }),
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
});
