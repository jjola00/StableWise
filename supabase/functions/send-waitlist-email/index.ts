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
    const { toEmail, fromName, fromEmail, subject, message } = await req.json();

    console.log('Processing waitlist email request for:', toEmail);

    // Get Zoho SMTP configuration
    const host = Deno.env.get("ZOHO_SMTP_HOST");
    const port = Number(Deno.env.get("ZOHO_SMTP_PORT") ?? "465");
    const user = Deno.env.get("ZOHO_SMTP_USER");
    const pass = Deno.env.get("ZOHO_SMTP_PASS");
    const from = Deno.env.get("ZOHO_FROM_EMAIL") ?? user;

    if (!host || !user || !pass) {
      console.error('Missing SMTP configuration');
      return new Response(JSON.stringify({ error: "SMTP configuration incomplete" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize SMTP client
    const client = new SmtpClient();

    // Connect with SSL for port 465
    await client.connectTLS({ 
      hostname: host, 
      port, 
      username: user, 
      password: pass 
    });

    // Send email
    await client.send({
      from,
      to: toEmail,
      subject: subject || `Welcome to the ${fromName} Waitlist`,
      content: message,
      html: true,
    });

    await client.close();

    console.log('Waitlist email sent successfully');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Waitlist email failed:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to send email", 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});