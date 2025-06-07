-- Create custom_templates table for storing template metadata
CREATE TABLE IF NOT EXISTS public.custom_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'My Templates',
    price DECIMAL(10,2) DEFAULT 0.00,
    project_data JSONB NOT NULL DEFAULT '{}',
    checklist JSONB NOT NULL DEFAULT '[]',
    background_image_url TEXT,
    background_image_path TEXT,
    background_file_name TEXT,
    background_opacity INTEGER DEFAULT 30,
    image_controls JSONB DEFAULT '{"size": 100, "posX": 50, "posY": 50, "fitMode": "contain"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER custom_templates_updated_at
    BEFORE UPDATE ON public.custom_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_templates_user_id ON public.custom_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_templates_category ON public.custom_templates(category);
CREATE INDEX IF NOT EXISTS idx_custom_templates_created_at ON public.custom_templates(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own templates
CREATE POLICY "Users can view own templates" ON public.custom_templates
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can insert their own templates
CREATE POLICY "Users can insert own templates" ON public.custom_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own templates
CREATE POLICY "Users can update own templates" ON public.custom_templates
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can delete their own templates
CREATE POLICY "Users can delete own templates" ON public.custom_templates
    FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Create storage bucket for template images
INSERT INTO storage.buckets (id, name, public)
VALUES ('template-images', 'template-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for template images
CREATE POLICY "Anyone can view template images" ON storage.objects
    FOR SELECT USING (bucket_id = 'template-images');

CREATE POLICY "Users can upload template images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'template-images');

CREATE POLICY "Users can update their template images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'template-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their template images" ON storage.objects
    FOR DELETE USING (bucket_id = 'template-images' AND auth.uid()::text = (storage.foldername(name))[1]); 