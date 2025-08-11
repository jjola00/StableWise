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

  const onSubmit = async (values: FormValues) => {
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

    setSubmitted(true);
    toast({
      title: "You're in!",
      description: "You'll receive €100 in StableWise credits at launch.",
    });
    reset();
  };

  if (submitted && compact) {
    return (
      <div className="rounded-lg border bg-card p-4 text-center">
        <p className="text-sm">You're in! 🎉 You'll receive €100 in StableWise credits when we launch.</p>
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
          <p>You're in! 🎉 You'll receive €100 in StableWise credits when we launch.</p>
        </div>
      )}
    </form>
  );
};
