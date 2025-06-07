import { supabase } from '@/lib/supabaseClient';

export interface TemplateData {
  id?: string;
  name: string;
  category: string;
  price: number;
  projectData: any;
  checklist: any[];
  backgroundImageUrl?: string;
  backgroundImagePath?: string;
  backgroundFileName?: string;
  backgroundOpacity: number;
  imageControls: any;
  createdAt: string;
  updatedAt?: string;
  userId?: string;
}

class TemplateStorageService {
  private readonly BUCKET_NAME = 'template-images';
  private readonly TABLE_NAME = 'custom_templates';

  /**
   * Check if Supabase is properly initialized
   */
  private isSupabaseAvailable(): boolean {
    return !!(supabase as any)?.storage && !!(supabase as any)?.from;
  }

  /**
   * Initialize the storage bucket (call this once when setting up)
   */
  async initializeBucket() {
    try {
      if (!this.isSupabaseAvailable()) {
        return { success: false, error: 'Supabase not properly initialized' };
      }

      // Check if bucket exists, create if it doesn't
      const { data: buckets, error: listError } = await (supabase as any).storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        return { success: false, error: listError };
      }

      const bucketExists = buckets?.find((bucket: any) => bucket.name === this.BUCKET_NAME);
      
      if (!bucketExists) {
        const { data, error } = await (supabase as any).storage.createBucket(this.BUCKET_NAME, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          fileSizeLimit: 10485760 // 10MB limit
        });

        if (error) {
          console.error('Error creating bucket:', error);
          return { success: false, error };
        }

        console.log('✅ Template images bucket created successfully');
      }

      return { success: true };
    } catch (error) {
      console.error('Error initializing bucket:', error);
      return { success: false, error };
    }
  }

  /**
   * Upload background image to Supabase Storage
   */
  async uploadBackgroundImage(file: File, templateId: string): Promise<{ success: boolean; url?: string; path?: string; error?: any }> {
    try {
      if (!this.isSupabaseAvailable()) {
        return { success: false, error: 'Supabase not properly initialized' };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${templateId}-${Date.now()}.${fileExt}`;
      const filePath = `backgrounds/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await (supabase as any).storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        return { success: false, error };
      }

      // Get public URL
      const { data: { publicUrl } } = (supabase as any).storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: publicUrl,
        path: filePath
      };
    } catch (error) {
      console.error('Error in uploadBackgroundImage:', error);
      return { success: false, error };
    }
  }

  /**
   * Save template to Supabase database
   */
  async saveTemplate(templateData: TemplateData, backgroundImageFile?: File): Promise<{ success: boolean; data?: any; error?: any }> {
    try {
      if (!this.isSupabaseAvailable()) {
        return { success: false, error: 'Supabase not properly initialized' };
      }

      console.log('🚀 Starting template save to Supabase...');

      const templateId = templateData.id || `template_${Date.now()}`;
      let backgroundImageUrl = null;
      let backgroundImagePath = null;

      // Upload background image if provided
      if (backgroundImageFile) {
        console.log('📸 Uploading background image...');
        const uploadResult = await this.uploadBackgroundImage(backgroundImageFile, templateId);
        
        if (!uploadResult.success) {
          console.error('Failed to upload background image:', uploadResult.error);
          return { success: false, error: uploadResult.error };
        }

        backgroundImageUrl = uploadResult.url;
        backgroundImagePath = uploadResult.path;
        console.log('✅ Background image uploaded successfully');
      }

      // Prepare template data for database
      const dbData = {
        id: templateId,
        name: templateData.name,
        category: templateData.category,
        price: templateData.price,
        project_data: templateData.projectData,
        checklist: templateData.checklist,
        background_image_url: backgroundImageUrl,
        background_image_path: backgroundImagePath,
        background_file_name: templateData.backgroundFileName,
        background_opacity: templateData.backgroundOpacity,
        image_controls: templateData.imageControls,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('💾 Saving template data to database...');

      // Insert template into database
      const { data, error } = await (supabase as any)
        .from(this.TABLE_NAME)
        .insert(dbData)
        .select()
        .single();

      if (error) {
        console.error('Error saving template to database:', error);
        
        // If database save fails and we uploaded an image, clean it up
        if (backgroundImagePath) {
          await this.deleteBackgroundImage(backgroundImagePath);
        }
        
        return { success: false, error };
      }

      console.log('✅ Template saved successfully to Supabase');
      return { success: true, data };
      
    } catch (error) {
      console.error('Error in saveTemplate:', error);
      return { success: false, error };
    }
  }

  /**
   * Load all custom templates from Supabase
   */
  async loadTemplates(): Promise<{ success: boolean; templates?: TemplateData[]; error?: any }> {
    try {
      if (!this.isSupabaseAvailable()) {
        return { success: false, error: 'Supabase not properly initialized' };
      }

      console.log('📋 Loading templates from Supabase...');

      const { data, error } = await (supabase as any)
        .from(this.TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading templates:', error);
        return { success: false, error };
      }

      // Convert database format to our template format
      const templates: TemplateData[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price || 0,
        projectData: item.project_data,
        checklist: item.checklist || [],
        backgroundImageUrl: item.background_image_url,
        backgroundImagePath: item.background_image_path,
        backgroundFileName: item.background_file_name,
        backgroundOpacity: item.background_opacity || 30,
        imageControls: item.image_controls || { size: 100, posX: 50, posY: 50, fitMode: 'contain' },
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      console.log(`✅ Loaded ${templates.length} templates from Supabase`);
      return { success: true, templates };
      
    } catch (error) {
      console.error('Error in loadTemplates:', error);
      return { success: false, error };
    }
  }

  /**
   * Delete a template and its associated image
   */
  async deleteTemplate(templateId: string): Promise<{ success: boolean; error?: any }> {
    try {
      if (!this.isSupabaseAvailable()) {
        return { success: false, error: 'Supabase not properly initialized' };
      }

      // First get the template to find the image path
      const { data: template, error: fetchError } = await (supabase as any)
        .from(this.TABLE_NAME)
        .select('background_image_path')
        .eq('id', templateId)
        .single();

      if (fetchError) {
        console.error('Error fetching template for deletion:', fetchError);
        return { success: false, error: fetchError };
      }

      // Delete the background image if it exists
      if (template?.background_image_path) {
        await this.deleteBackgroundImage(template.background_image_path);
      }

      // Delete the template from database
      const { error: deleteError } = await (supabase as any)
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', templateId);

      if (deleteError) {
        console.error('Error deleting template:', deleteError);
        return { success: false, error: deleteError };
      }

      console.log('✅ Template deleted successfully');
      return { success: true };
      
    } catch (error) {
      console.error('Error in deleteTemplate:', error);
      return { success: false, error };
    }
  }

  /**
   * Delete background image from storage
   */
  private async deleteBackgroundImage(imagePath: string): Promise<void> {
    try {
      if (!this.isSupabaseAvailable()) {
        console.error('Supabase not available for image deletion');
        return;
      }

      const { error } = await (supabase as any).storage
        .from(this.BUCKET_NAME)
        .remove([imagePath]);

      if (error) {
        console.error('Error deleting background image:', error);
      } else {
        console.log('✅ Background image deleted successfully');
      }
    } catch (error) {
      console.error('Error in deleteBackgroundImage:', error);
    }
  }

  /**
   * Check if Supabase is available and initialized
   */
  async checkConnection(): Promise<{ success: boolean; error?: any }> {
    try {
      if (!this.isSupabaseAvailable()) {
        return { success: false, error: 'Supabase not properly initialized' };
      }

      const { data, error } = await (supabase as any)
        .from(this.TABLE_NAME)
        .select('id')
        .limit(1);

      if (error) {
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}

// Export a singleton instance
export const templateStorageService = new TemplateStorageService(); 