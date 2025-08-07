import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { TrendingUp, Shield, Search, Database } from "lucide-react";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url('/lovable-uploads/78ffd265-828c-442f-b071-428b39442203.png')`,
        }}
      >
        <div className="container mx-auto px-4 text-center">
          {/* New main heading */}
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-2">
            StableWise
          </h1>

          {/* Existing tagline moved down one level and resized */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transparent Sport Horse
            <br />
            <span className="text-primary">& Pony Sales</span>
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Access verified performance data, competition histories, and AI-powered insights for international sport horses and ponies. No guesswork, just facts.
          </p>
          
          <div className="mb-12">
            <SearchBar variant="hero" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/for-sale">
              <Button size="lg" className="w-full sm:w-auto">
                Browse For Sale
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why StableWise?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-primary/20">
              <CardContent className="p-6 text-center">
                <Database className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Verified Data</h3>
                <p className="text-muted-foreground">
                  Competition results from verified sources across international venues.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI Performance Analysis</h3>
                <p className="text-muted-foreground">
                  Get intelligent summaries of competition performance and trends.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Trust & Transparency</h3>
                <p className="text-muted-foreground">
                  No inflated claims - just documented performance history.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-6 text-center">
                <Search className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">International Scope</h3>
                <p className="text-muted-foreground">
                  Sport horses and ponies from competitions worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Next Champion?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Browse verified listings or search our comprehensive database
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/for-sale">
              <Button size="lg" className="w-full sm:w-auto">
                View For Sale Listings
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                List Your Horse/Pony
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};