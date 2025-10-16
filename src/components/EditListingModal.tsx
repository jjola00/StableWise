import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Edit, Loader2, Upload, X, Star } from "lucide-react";

interface EditListingModalProps {
  listing: any;
  onListingUpdated: () => void;
}

export const EditListingModal = ({ listing, onListingUpdated }: EditListingModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [animalData, setAnimalData] = useState({
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
    national_representation: false,
    image_urls: [] as string[],
  });
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (listing && isOpen) {
      // Fetch full animal data
      fetchAnimalData();
      setDescription(listing.description || listing.ai_generated_description || "");
    }
  }, [listing, isOpen]);

  const fetchAnimalData = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('animals')
        .select('*')
        .eq('id', listing.animals.id)
        .single();

      if (error) throw error;
      
      setAnimalData({
        name: data.name || "",
        age: data.age || 0,
        height_cm: data.height_cm || 0,
        breed: data.breed || "",
        dam: data.dam || "",
        sire: data.sire || "",
        coloring: data.coloring || "",
        microchip_number: data.microchip_number || "",
        passport_number: data.passport_number || "",
        country: data.country || "",
        is_pony: data.is_pony || false,
        national_representation: data.national_representation || false,
        image_urls: data.image_urls || [],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load animal data",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('horse-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('horse-images')
          .getPublicUrl(fileName);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setAnimalData(prev => ({
        ...prev,
        image_urls: [...prev.image_urls, ...uploadedUrls]
      }));

      toast({
        title: "Success",
        description: "Images uploaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setAnimalData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update animal data
      const { error: animalError } = await (supabase as any)
        .from('animals')
        .update(animalData)
        .eq('id', listing.animals.id);

      if (animalError) throw animalError;

      // Update listing data
      const { error: listingError } = await (supabase as any)
        .from('for_sale_listings')
        .update({
          description,
          price: price ? parseFloat(price) : null,
          contact_info: contactInfo
        })
        .eq('id', listing.id);

      if (listingError) throw listingError;

      toast({
        title: "Success",
        description: "Listing updated successfully!",
      });

      setIsOpen(false);
      onListingUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update listing",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing: {listing.animals.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={animalData.name}
                onChange={(e) => setAnimalData({...animalData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-breed">Breed</Label>
              <Input
                id="edit-breed"
                value={animalData.breed}
                onChange={(e) => setAnimalData({...animalData, breed: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-age">Age</Label>
              <Input
                id="edit-age"
                type="number"
                value={animalData.age || ''}
                onChange={(e) => setAnimalData({...animalData, age: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="edit-height">Height (cm)</Label>
              <Input
                id="edit-height"
                type="number"
                value={animalData.height_cm || ''}
                onChange={(e) => setAnimalData({...animalData, height_cm: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Photos</Label>
            <div className="mt-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="edit-image-upload"
                disabled={uploadingImages}
              />
              <Label
                htmlFor="edit-image-upload"
                className="flex items-center justify-center w-full p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="text-center">
                  {uploadingImages ? (
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                  ) : (
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  )}
                  <p className="text-sm text-muted-foreground">
                    {uploadingImages ? 'Uploading...' : 'Click to upload more photos'}
                  </p>
                </div>
              </Label>
            </div>
            
            {/* Image Preview */}
            {animalData.image_urls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {animalData.image_urls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-is-pony"
                checked={animalData.is_pony}
                onCheckedChange={(checked) => setAnimalData({...animalData, is_pony: !!checked})}
              />
              <Label htmlFor="edit-is-pony">This is a pony (not a horse)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-national-representation"
                checked={animalData.national_representation}
                onCheckedChange={(checked) => setAnimalData({...animalData, national_representation: !!checked})}
              />
              <Label htmlFor="edit-national-representation" className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Has represented country in competition</span>
              </Label>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Price and Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-price">Price (optional)</Label>
              <Input
                id="edit-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
              />
            </div>
            <div>
              <Label htmlFor="edit-contact">Contact Info (optional)</Label>
              <Input
                id="edit-contact"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Phone or additional contact"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};