import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, MapPin, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ForSaleListing {
  id: string;
  description: string;
  ai_generated_description: string;
  is_active: boolean;
  featured: boolean;
  created_at: string;
  horse: {
    id: string;
    name: string;
    age: number;
    height_cm: number | null;
    breed: string | null;
    dam: string | null;
    sire: string | null;
    coloring: string | null;
    microchip_number: string | null;
    passport_number: string | null;
    country: string | null;
    is_pony: boolean;
  };
  profiles: {
    stable_name: string;
    country: string;
  };
}

export const ForSale = () => {
  const [listings, setListings] = useState<ForSaleListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      
      const { data: rows, error } = await (supabase as any)
        .from('for_sale_listings')
        .select(`*, profiles ( stable_name, country ), horses ( fei_id, name, date_of_birth, studbook, dam, sire, color, microchip, ueln, country_of_birth, is_pony )`)
        .eq('is_active', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (rows || []).map((row: any) => {
        const horseRow = row.horses;
        const today = new Date();
        const dob = horseRow?.date_of_birth ? new Date(horseRow.date_of_birth) : undefined;
        const age = dob
          ? today.getFullYear() - dob.getFullYear() - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0)
          : 0;

        return {
          id: row.id,
          description: row.description,
          ai_generated_description: row.ai_generated_description,
          is_active: row.is_active,
          featured: row.featured,
          created_at: row.created_at,
          horse: {
            id: horseRow.fei_id,
            name: horseRow.name,
            age,
            height_cm: null,
            breed: horseRow.studbook ?? null,
            dam: horseRow.dam ?? null,
            sire: horseRow.sire ?? null,
            coloring: horseRow.color ?? null,
            microchip_number: horseRow.microchip ?? null,
            passport_number: horseRow.ueln ?? null,
            country: horseRow.country_of_birth ?? null,
            is_pony: horseRow.is_pony,
          },
          profiles: row.profiles,
        } as ForSaleListing;
      });

      setListings(mapped);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error",
        description: "Failed to load for sale listings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Sport Horses & Ponies For Sale</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse verified listings with transparent performance data. All prices POA (Price on Application).
          </p>
        </div>

        {/* Listings Grid */}
        {listings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {listing.featured && (
                  <div className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
                    Featured Listing
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{listing.horse.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={listing.horse.is_pony ? "secondary" : "default"}>
                          {listing.horse.is_pony ? 'Pony' : 'Horse'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {listing.horse.age}yo {listing.horse.height_cm ? `• ${listing.horse.height_cm}cm` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Basic Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Breed:</span><br />
                      <span className="text-muted-foreground">{listing.horse.breed}</span>
                    </div>
                    <div>
                      <span className="font-medium">Color:</span><br />
                      <span className="text-muted-foreground">{listing.horse.coloring}</span>
                    </div>
                    <div>
                      <span className="font-medium">Dam:</span><br />
                      <span className="text-muted-foreground">{listing.horse.dam}</span>
                    </div>
                    <div>
                      <span className="font-medium">Sire:</span><br />
                      <span className="text-muted-foreground">{listing.horse.sire}</span>
                    </div>
                  </div>

                  {/* Registration */}
                  <div className="border-t pt-4">
                    <div className="text-sm space-y-1">
                      <div><strong>Microchip:</strong> {listing.horse.microchip_number}</div>
                      <div><strong>Passport:</strong> {listing.horse.passport_number}</div>
                      <div><strong>Country:</strong> {listing.horse.country}</div>
                    </div>
                  </div>

                  {/* Description */}
                  {(listing.description || listing.ai_generated_description) && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {listing.ai_generated_description || listing.description}
                      </p>
                      {listing.ai_generated_description && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">AI Generated</Badge>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Seller Info */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">Seller:</span><br />
                        <span className="text-muted-foreground">
                          {listing.profiles.stable_name || 'Private Seller'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">Location:</span><br />
                        <span className="text-muted-foreground">{listing.profiles.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t pt-4 space-y-2">
                    <Link to={`/animal/${listing.horse.id}`}>
                      <Button className="w-full">View Performance Data</Button>
                    </Link>
                    <div className="text-center text-sm text-muted-foreground">
                      Price on Application (POA)
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-4">No Listings Available</h3>
            <p className="text-muted-foreground mb-8">
              There are currently no horses or ponies listed for sale.
            </p>
            <Link to="/auth">
              <Button>List Your Horse/Pony</Button>
            </Link>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 py-12 bg-muted/30 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Want to List Your Horse or Pony?</h3>
          <p className="text-muted-foreground mb-6">
            Join our platform and reach serious buyers with transparent, data-driven listings.
          </p>
          <Link to="/auth">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};