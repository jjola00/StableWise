import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, MapPin, Calendar, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Animal {
  id: string;
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

interface CompetitionResult {
  id: string;
  competition_name: string;
  competition_date: string;
  location: string;
  rider_name: string;
  fence_height_cm: number;
  faults: number;
  placement: number;
  total_competitors: number;
  time_seconds: number;
}

export const AnimalProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [competitions, setCompetitions] = useState<CompetitionResult[]>([]);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchAnimalData();
    }
  }, [id]);

  const fetchAnimalData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch animal details
      const { data: animalData, error: animalError } = await (supabase as any)
        .from('animals')
        .select('*')
        .eq('id', id)
        .single();

      if (animalError) throw animalError;
      setAnimal(animalData);

      // Fetch competition results
      const { data: competitionData, error: competitionError } = await (supabase as any)
        .from('competition_results')
        .select('*')
        .eq('animal_id', id)
        .order('competition_date', { ascending: false });

      if (competitionError) throw competitionError;
      setCompetitions(competitionData || []);

    } catch (error) {
      console.error('Error fetching animal data:', error);
      toast({
        title: "Error",
        description: "Failed to load animal profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAISummary = async () => {
    if (!animal) return;

    setIsGeneratingSummary(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-performance-summary', {
        body: {
          animalName: animal.name,
          animalType: animal.is_pony ? 'pony' : 'horse',
          competitionResults: competitions
        }
      });

      if (error) throw error;
      setAiSummary(data.summary);
      
      toast({
        title: "Summary Generated",
        description: "AI performance analysis complete",
      });
    } catch (error) {
      console.error('Error generating AI summary:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI summary",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Animal Not Found</h1>
          <p className="text-muted-foreground">The requested animal profile could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{animal.name}</h1>
              <div className="flex items-center space-x-4">
                <Badge variant={animal.is_pony ? "secondary" : "default"}>
                  {animal.is_pony ? 'Pony' : 'Horse'}
                </Badge>
                <span className="text-muted-foreground">{animal.age} years • {animal.height_cm}cm</span>
                <span className="text-muted-foreground">{animal.breed}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Basic Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Animal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground">Breeding</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Dam:</strong> {animal.dam}<br />
                    <strong>Sire:</strong> {animal.sire}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Physical</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Height:</strong> {animal.height_cm}cm<br />
                    <strong>Color:</strong> {animal.coloring}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Registration</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Microchip:</strong> {animal.microchip_number}<br />
                    <strong>Passport:</strong> {animal.passport_number}<br />
                    <strong>Country:</strong> {animal.country}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Competition Results & AI Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span>AI Performance Summary</span>
                  </CardTitle>
                  <Button 
                    onClick={generateAISummary} 
                    disabled={isGeneratingSummary}
                    size="sm"
                  >
                    {isGeneratingSummary ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Generate Summary
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {aiSummary ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed whitespace-pre-line">
                      {aiSummary}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    Click "Generate Summary" to get an AI-powered analysis of {animal.name}'s performance.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Competition Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span>Competition History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {competitions.length > 0 ? (
                  <div className="space-y-4">
                    {competitions.map((comp) => (
                      <div key={comp.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-foreground">{comp.competition_name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(comp.competition_date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {comp.location}
                              </span>
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {comp.rider_name}
                              </span>
                            </div>
                          </div>
                          <Badge variant={comp.placement <= 3 ? "default" : "secondary"}>
                            {comp.placement}/{comp.total_competitors}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Fence Height:</span><br />
                            <span className="text-muted-foreground">{comp.fence_height_cm}cm</span>
                          </div>
                          <div>
                            <span className="font-medium">Faults:</span><br />
                            <span className="text-muted-foreground">{comp.faults}</span>
                          </div>
                          {comp.time_seconds && (
                            <div>
                              <span className="font-medium">Time:</span><br />
                              <span className="text-muted-foreground">{comp.time_seconds}s</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No competition results available.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};