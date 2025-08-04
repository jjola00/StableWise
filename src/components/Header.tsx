import { Button } from "@/components/ui/button";
import { Search, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Logo } from "./Logo";

export const Header = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
      {/*
        Using a max-width wrapper keeps the content from stretching too wide on ultra-large screens
        while still allowing the logo to sit fully left and the menu fully right.
      */}
      <div className="mx-auto max-w-screen-xl flex items-center justify-between px-4 py-4 w-full">
        {/* Left – Logo */}
        <Logo />

        {/* Right – Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/for-sale" className="text-foreground hover:text-primary transition-colors">
            For Sale
          </Link>
          {user ? (
            <>
              <Link to="/seller-dashboard" className="text-foreground hover:text-primary transition-colors">
                My Stable
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </nav>

        {/* Right – Mobile auth button */}
        <div className="md:hidden">
          <Link to="/auth">
            <Button variant="outline" size="sm">
              <User className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};