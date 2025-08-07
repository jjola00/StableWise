-- Create storage bucket for horse images
INSERT INTO storage.buckets (id, name, public) VALUES ('horse-images', 'horse-images', true);

-- Create policies for horse image uploads
CREATE POLICY "Anyone can view horse images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'horse-images');

CREATE POLICY "Authenticated users can upload horse images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'horse-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own horse images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'horse-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own horse images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'horse-images' AND auth.uid() IS NOT NULL);

-- Add image_urls column to animals table
ALTER TABLE animals ADD COLUMN image_urls TEXT[];

-- Add national_representation column for badges
ALTER TABLE animals ADD COLUMN national_representation BOOLEAN DEFAULT FALSE;

-- Update for_sale_listings to allow editing
ALTER TABLE for_sale_listings ADD COLUMN price DECIMAL(10,2);
ALTER TABLE for_sale_listings ADD COLUMN contact_info TEXT;