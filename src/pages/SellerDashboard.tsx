import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { Loader2, Plus, Sparkles, Crown } from "lucide-react";

interface AnimalForm {
  name: string;
  age: number;
  height_cm: number;
  breed: string;
  dam: string;
  sire: string;
  coloring: string;
  microchip_number: string;
  passport_number: string;
  country: string;
  is_pony: boolean;
}

interface Listing {
  id: string;
  description: string;
  ai_generated_description: string;
  is_active: boolean;
  animals: {
    id: string;
    name: string;
    is_pony: boolean;
  };
}

export const SellerDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [newAnimal, setNewAnimal] = useState<AnimalForm>({
    name: "",
    age: 0,
    height_cm: 0,
    breed: "",
    dam: "",
    sire: "",
    coloring: "",
    microchip_number: "",
    passport_number: "",
    country: "",
    is_pony: false,
  });
  const [listingDescription, setListingDescription] = useState("");
  const [useAIDescription, setUseAIDescription] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setSession(session);
      setUser(session.user);
      fetchUserListings(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setSession(session);
      setUser(session.user);
      if (event === 'SIGNED_IN') {
        fetchUserListings(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserListings = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // First get user profile
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!profile) {
        console.log('No profile found for user');
        setListings([]);
        return;
      }

      // Then get listings
      const { data, error } = await (supabase as any)
        .from('for_sale_listings')
        .select(`
          id, description, ai_generated_description, is_active,
          animals (id, name, is_pony)
        `)
        .eq('seller_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error",
        description: "Failed to load your listings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAnimal = async () => {
    if (!session?.user) return;

    // Validation
    if (!newAnimal.name || !newAnimal.breed || !newAnimal.age || !newAnimal.height_cm) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // First, create the animal
      const { data: animalData, error: animalError } = await (supabase as any)
        .from('animals')
        .insert(newAnimal)
        .select()
        .single();

      if (animalError) throw animalError;

      // Get user profile
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      // Create listing
      let finalDescription = listingDescription;
      
      if (useAIDescription) {
        setIsGeneratingAI(true);
        try {
          const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-performance-summary', {
            body: {
              animalName: newAnimal.name,
              animalType: newAnimal.is_pony ? 'pony' : 'horse',
              competitionResults: [] // No results yet for new animals
            }
          });

          if (!aiError && aiData?.summary) {
            finalDescription = aiData.summary;
          }
        } catch (aiError) {
          console.warn('AI description generation failed:', aiError);
        } finally {
          setIsGeneratingAI(false);
        }
      }

      const { error: listingError } = await (supabase as any)
        .from('for_sale_listings')
        .insert({
          animal_id: animalData.id,
          seller_id: profile.id,
          description: useAIDescription ? '' : listingDescription,
          ai_generated_description: useAIDescription ? finalDescription : '',
          is_active: true
        });

      if (listingError) throw listingError;

      toast({
        title: "Success",
        description: "Animal listed for sale successfully!",
      });

      // Reset form
      setNewAnimal({
        name: "",
        age: 0,
        height_cm: 0,
        breed: "",
        dam: "",
        sire: "",
        coloring: "",
        microchip_number: "",
        passport_number: "",
        country: "",
        is_pony: false,
      });
      setListingDescription("");
      setUseAIDescription(false);
      setShowAddForm(false);
      
      // Refresh listings
      fetchUserListings(session.user.id);
    } catch (error: any) {
      console.error('Error adding animal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to list animal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsGeneratingAI(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your horse and pony listings</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>List New Animal</span>
          </Button>
        </div>

        {/* Premium Feature Teaser */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Premium Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered price estimates and advanced analytics (Coming Soon)
                  </p>
                </div>
              </div>
              <Button variant="outline" disabled>
                Upgrade to Premium
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Listings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : listings.length > 0 ? (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div key={listing.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{listing.animals.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={listing.animals.is_pony ? "secondary" : "default"}>
                            {listing.animals.is_pony ? 'Pony' : 'Horse'}
                          </Badge>
                          <Badge variant={listing.is_active ? "default" : "secondary"}>
                            {listing.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {listing.ai_generated_description && (
                            <Badge variant="outline" className="text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI Description
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/animal/${listing.animals.id}`} target="_blank">
                          View Profile
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't listed any animals yet.</p>
                <Button onClick={() => setShowAddForm(true)}>
                  List Your First Animal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add New Animal Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>List New Animal for Sale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newAnimal.name}
                    onChange={(e) => setNewAnimal({...newAnimal, name: e.target.value})}
                    placeholder="Animal name"
                  />
                </div>
                <div>
                  <Label htmlFor="breed">Breed *</Label>
                  <Input
                    id="breed"
                    value={newAnimal.breed}
                    onChange={(e) => setNewAnimal({...newAnimal, breed: e.target.value})}
                    placeholder="e.g. Warmblood, Thoroughbred"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={newAnimal.age || ''}
                    onChange={(e) => setNewAnimal({...newAnimal, age: parseInt(e.target.value) || 0})}
                    placeholder="Age in years"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm) *</Label>
                  <Input
                    id="height"
                    type="number"
                    value={newAnimal.height_cm || ''}
                    onChange={(e) => setNewAnimal({...newAnimal, height_cm: parseInt(e.target.value) || 0})}
                    placeholder="Height in centimeters"
                  />
                </div>
                <div>
                  <Label htmlFor="coloring">Color</Label>
                  <Input
                    id="coloring"
                    value={newAnimal.coloring}
                    onChange={(e) => setNewAnimal({...newAnimal, coloring: e.target.value})}
                    placeholder="e.g. Bay, Chestnut, Grey"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={newAnimal.country}
                    onChange={(e) => setNewAnimal({...newAnimal, country: e.target.value})}
                    placeholder="Country of origin"
                  />
                </div>
              </div>

              {/* Breeding Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dam">Dam</Label>
                  <Input
                    id="dam"
                    value={newAnimal.dam}
                    onChange={(e) => setNewAnimal({...newAnimal, dam: e.target.value})}
                    placeholder="Mother's name"
                  />
                </div>
                <div>
                  <Label htmlFor="sire">Sire</Label>
                  <Input
                    id="sire"
                    value={newAnimal.sire}
                    onChange={(e) => setNewAnimal({...newAnimal, sire: e.target.value})}
                    placeholder="Father's name"
                  />
                </div>
              </div>

              {/* Registration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="microchip">Microchip Number</Label>
                  <Input
                    id="microchip"
                    value={newAnimal.microchip_number}
                    onChange={(e) => setNewAnimal({...newAnimal, microchip_number: e.target.value})}
                    placeholder="Microchip ID"
                  />
                </div>
                <div>
                  <Label htmlFor="passport">Passport Number</Label>
                  <Input
                    id="passport"
                    value={newAnimal.passport_number}
                    onChange={(e) => setNewAnimal({...newAnimal, passport_number: e.target.value})}
                    placeholder="Passport/Registration ID"
                  />
                </div>
              </div>

              {/* Pony/Horse designation */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_pony"
                  checked={newAnimal.is_pony}
                  onCheckedChange={(checked) => setNewAnimal({...newAnimal, is_pony: !!checked})}
                />
                <Label htmlFor="is_pony">This is a pony (not a horse)</Label>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id="use_ai"
                    checked={useAIDescription}
                    onCheckedChange={(checked) => setUseAIDescription(!!checked)}
                  />
                  <Label htmlFor="use_ai" className="flex items-center space-x-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI description</span>
                  </Label>
                </div>
                {!useAIDescription && (
                  <>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={listingDescription}
                      onChange={(e) => setListingDescription(e.target.value)}
                      placeholder="Describe the animal's qualities, training, and suitability..."
                      rows={4}
                    />
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddAnimal}
                  disabled={isSubmitting || isGeneratingAI}
                  className="flex items-center space-x-2"
                >
                  {isSubmitting || isGeneratingAI ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>
                    {isGeneratingAI ? 'Generating AI Description...' : 
                     isSubmitting ? 'Adding...' : 'List for Sale'}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};