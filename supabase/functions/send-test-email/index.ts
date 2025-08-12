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
    const { toEmail } = (await req.json().catch(() => ({}) )) as { toEmail?: string };

    const smtpHost = Deno.env.get("ZOHO_SMTP_HOST") ?? "smtp.zoho.com";
    const smtpPort = Number(Deno.env.get("ZOHO_SMTP_PORT") ?? 465);
    const smtpUser = Deno.env.get("ZOHO_SMTP_USER") ?? "";
    const smtpPass = Deno.env.get("ZOHO_SMTP_PASS") ?? "";
    const fromAddress = Deno.env.get("ZOHO_FROM_EMAIL") ?? "info@stablewise.org";

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("SMTP configuration missing. Expected ZOHO_SMTP_HOST, ZOHO_SMTP_USER, ZOHO_SMTP_PASS.");
      return new Response(JSON.stringify({ error: "SMTP configuration missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const client = new SmtpClient();

    if (smtpPort === 465) {
      await client.connectTLS({ hostname: smtpHost, port: smtpPort, username: smtpUser, password: smtpPass });
    } else {
      await client.connect({ hostname: smtpHost, port: smtpPort, username: smtpUser, password: smtpPass });
    }

    const recipient = toEmail || fromAddress;
    const subject = "StableWise SMTP Test Email";
    const now = new Date().toISOString();
    const html = `
      <h1>StableWise SMTP Test</h1>
      <p>This is a test email sent via Zoho SMTP from StableWise.</p>
      <p><strong>Timestamp:</strong> ${now}</p>
      <p><strong>Environment:</strong> Supabase Edge Functions (Deno)</p>
      <hr />
      <p>If you received this, SMTP is configured correctly.</p>
    `;

    const sendResult = await client.send({
      from: fromAddress,
      to: recipient,
      subject,
      content: `StableWise SMTP Test (plain text) - ${now}`,
      html,
    });

    await client.close();

    return new Response(JSON.stringify({ ok: true, result: sendResult, to: recipient }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error in send-test-email:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
