import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { toEmail, fromName, fromEmail, phone, message } = await req.json();

    const host = Deno.env.get("ZOHO_SMTP_HOST")!;
    const port = Number(Deno.env.get("ZOHO_SMTP_PORT") ?? "465");
    const user = Deno.env.get("ZOHO_SMTP_USER")!;
    const pass = Deno.env.get("ZOHO_SMTP_PASS")!;
    const from = Deno.env.get("ZOHO_FROM_EMAIL") ?? user;

    // Zoho requires auth user == from address
    const client = new SmtpClient();

    // For 465 (SSL):
    await client.connectTLS({ hostname: host, port, username: user, password: pass });
    // If you choose port 587 instead, use:
    // await client.connect({ hostname: host, port, username: user, password: pass, tls: true });

    await client.send({
      from,
      to: toEmail,
      subject: `New message from ${fromName} via StableWise`,
      // smtp module supports HTML via "html: true" + content
      content: `
        <p><strong>Name:</strong> ${fromName}</p>
        <p><strong>Email:</strong> ${fromEmail}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
      html: true,
    });

    await client.close();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("SMTP send failed:", error);
    return new Response(JSON.stringify({ error: "Email send failed" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
