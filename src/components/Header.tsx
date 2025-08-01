import { Button } from "@/components/ui/button";
import { Search, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";

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
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">StableWise</h1>
              <p className="text-xs text-muted-foreground">International Sport Horse & Pony Database</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/search" className="text-foreground hover:text-primary transition-colors">
              Search
            </Link>
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

          {/* Mobile menu button - simplified for MVP */}
          <div className="md:hidden">
            <Link to="/auth">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};