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

    console.log('Processing contact email request for:', toEmail);

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
      subject: `New message from ${fromName} via StableWise`,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Request from StableWise</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${fromName}</p>
            <p><strong>Email:</strong> ${fromEmail}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 14px;">
            This message was sent through the StableWise contact form. 
            You can reply directly to this email to respond to ${fromName}.
          </p>
        </div>
      `,
      html: true,
    });

    await client.close();

    console.log('Contact email sent successfully');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Contact email failed:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to send message", 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});