import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  full_name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  country: z.string().optional(),
  user_type: z.enum(["Buyer", "Seller", "Other"]).optional(),
});

type FormValues = z.infer<typeof schema>;

export const WaitlistForm = ({ compact = false }: { compact?: boolean }) => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const EMAIL_FN_URL = import.meta.env.VITE_EMAIL_FN_URL || "/.netlify/functions/send-email";

  const onSubmit = async (values: FormValues) => {
    // 1) Save to Supabase
    const { error } = await (supabase as any).from("waitlist_signups").insert({
      full_name: values.full_name,
      email: values.email,
      country: values.country || null,
      user_type: values.user_type || null,
    });

    if (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    // 2) Send confirmation email via Netlify function
    try {
      const siteUrl =
        typeof window !== "undefined" ? window.location.origin : "https://stablewise.org";

      const html = `
        <div style="font-family: Inter, system-ui, Arial, sans-serif; color: #111; line-height: 1.6; font-size: 14px;">
          <p>Hi ${values.full_name},</p>
          <p>Thanks for joining the <strong>StableWise</strong> waitlist! 🎉</p>
          <p>As an early signup, you’ll receive <strong>€100 in credits</strong> at launch.</p>
          <p>You can follow our progress or invite friends here:</p>
          <p><a href="${siteUrl}" target="_blank" rel="noopener noreferrer">${siteUrl}</a></p>
          <p>Welcome aboard,<br/>The StableWise Team</p>
        </div>
      `;

      const res = await fetch(EMAIL_FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: values.email,
          fromName: "StableWise",
          fromEmail: "info@stablewise.org",
          replyTo: "info@stablewise.org",
          subject: "Welcome to the StableWise Waitlist 🎉",
          phone: "",
          message: html,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to send confirmation email");
      }

      setSubmitted(true);
      toast({
        title: "You're in!",
        description: "Signup saved and confirmation email sent.",
      });
      reset();
    } catch (err: any) {
      toast({
        title: "Email not sent",
        description: err?.message || "We couldn't send your confirmation email.",
        variant: "destructive",
      });
    }
  };

  if (submitted && compact) {
    return (
      <div className="rounded-lg border bg-card p-4 text-center">
        <p className="text-sm">You're in! 🎉 Signup saved and a confirmation email has been sent.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`grid gap-4 ${compact ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1"}`}>
      <div className={`${compact ? "md:col-span-1" : ""}`}>
        <Label htmlFor="full_name">Full Name</Label>
        <Input id="full_name" placeholder="Jane Rider" {...register("full_name")} />
        {errors.full_name && (
          <p className="text-sm text-destructive mt-1">{errors.full_name.message}</p>
        )}
      </div>
      <div className={`${compact ? "md:col-span-1" : ""}`}>
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="jane@example.com" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>
      <div className={`${compact ? "md:col-span-1" : ""}`}>
        <Label htmlFor="country">Country (optional)</Label>
        <Input id="country" placeholder="Ireland" {...register("country")} />
      </div>
      <div className={`${compact ? "md:col-span-1" : ""}`}>
        <Label htmlFor="user_type">Type of User (optional)</Label>
        <Input id="user_type" placeholder="Buyer / Seller" {...register("user_type")} />
      </div>
      <div className={`${compact ? "md:col-span-4" : ""}`}>
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Joining..." : "Join Waitlist & Get €100 in Free Credits"}
        </Button>
      </div>
      {!compact && submitted && (
        <div className="rounded-lg border bg-card p-4 text-center">
          <p>You're in! 🎉 Signup saved and a confirmation email has been sent.</p>
        </div>
      )}
    </form>
  );
};
