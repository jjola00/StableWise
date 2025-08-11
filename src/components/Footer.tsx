import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} StableWise</p>
        <Link to="/waitlist">
          <Button size="sm">Join Waitlist – Get €100 in Credits</Button>
        </Link>
      </div>
    </footer>
  );
};
