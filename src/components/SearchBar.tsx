import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Animal {
  id: string;
  name: string;
  age: number;
  country: string;
  is_pony: boolean;
  breed: string;
}

interface SearchBarProps {
  variant?: "default" | "hero";
}

export const SearchBar = ({ variant = "default" }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Animal[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchAnimals = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        // Use a raw query to avoid type issues
        const { data, error } = await (supabase as any)
          .from("horses")
          .select("fei_id, name, date_of_birth, country_of_birth, is_pony, studbook")
          .ilike("name", `%${searchTerm}%`)
          .limit(8);

        // Map FEI schema to the local Animal interface
        const mapped: Animal[] = (data || []).map((row: any) => {
          const today = new Date();
          const dob = row.date_of_birth ? new Date(row.date_of_birth) : undefined;
          const age = dob ? today.getFullYear() - dob.getFullYear() - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0) : 0;

          return {
            id: row.fei_id,
            name: row.name,
            age,
            country: row.country_of_birth,
            is_pony: row.is_pony,
            breed: row.studbook,
          };
        });

        if (error) throw error;
        setSuggestions(mapped);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error searching animals:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchAnimals, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleAnimalSelect = (animal: Animal) => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/animal/${animal.id}`);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const isHero = variant === "hero";

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className={`flex ${isHero ? 'flex-col space-y-4' : 'space-x-2'}`}>
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground ${isHero ? 'w-6 h-6' : 'w-4 h-4'}`} />
          <Input
            type="text"
            placeholder="Search horses and ponies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`${isHero ? 'pl-12 py-6 text-lg' : 'pl-10'}`}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <Button 
          onClick={handleSearch}
          className={isHero ? 'py-6 text-lg' : ''}
        >
          Search
        </Button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {suggestions.map((animal) => (
            <button
              key={animal.id}
              onClick={() => handleAnimalSelect(animal)}
              className="w-full px-4 py-3 text-left hover:bg-accent transition-colors border-b last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{animal.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {animal.age}yo {animal.breed} • {animal.country}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {animal.is_pony ? 'Pony' : 'Horse'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};