import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Building, Save, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import SettingsPageTemplate from './SettingsPageTemplate';
import { CompanyLogoUpload } from '@/components/ui/CompanyLogoUpload';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CompanyInfo {
  name: string;
  abn: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  logo: File | null;
  logoUrl: string;
}

export default function CompanyInformation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    abn: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    logo: null,
    logoUrl: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);

  useEffect(() => {
    loadCompanyInfo();
  }, [user]);

  const loadCompanyInfo = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your-supabase-url' || 
          supabaseKey === 'your-supabase-anon-key') {
        console.warn('Supabase not configured, using local storage fallback');
        setIsSupabaseConfigured(false);
        
        // Load from localStorage as fallback
        const savedData = localStorage.getItem('company_info');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setCompanyInfo({
            name: parsedData.name || '',
            abn: parsedData.abn || '',
            email: parsedData.email || '',
            phone: parsedData.phone || '',
            address: parsedData.address || '',
            website: parsedData.website || '',
            description: parsedData.description || '',
            logo: null,
            logoUrl: parsedData.logoUrl || ''
          });
        }
        return;
      }

      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCompanyInfo({
          name: data.name || '',
          abn: data.abn || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          website: data.website || '',
          description: data.description || '',
          logo: null,
          logoUrl: data.logo_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading company info:', error);
      toast({
        title: 'Database Connection Issue',
        description: 'Using local storage for now. Please configure Supabase for persistent storage.',
        variant: 'destructive'
      });
      
      // Fallback to localStorage
      const savedData = localStorage.getItem('company_info');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setCompanyInfo({
          name: parsedData.name || '',
          abn: parsedData.abn || '',
          email: parsedData.email || '',
          phone: parsedData.phone || '',
          address: parsedData.address || '',
          website: parsedData.website || '',
          description: parsedData.description || '',
          logo: null,
          logoUrl: parsedData.logoUrl || ''
        });
      }
    } finally {
      setIsLoading(false);
    }
  };



  const uploadLogo = async (file: File): Promise<string | null> => {
    if (!user) return null;

    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl === 'your-supabase-url' || 
        supabaseKey === 'your-supabase-anon-key') {
      // Fallback: Convert to base64 and store locally
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          resolve(base64String);
        };
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_company_logo_${Date.now()}.${fileExt}`;
      const filePath = `company-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('company-assets')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading to Supabase, using local storage:', error);
      
      // Fallback to base64
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          resolve(base64String);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const saveCompanyInfo = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      let logoUrl = companyInfo.logoUrl;

      // Upload new logo if one was selected
      if (companyInfo.logo) {
        logoUrl = await uploadLogo(companyInfo.logo);
      }

      const dataToSave = {
        user_id: user.id,
        name: companyInfo.name,
        abn: companyInfo.abn,
        email: companyInfo.email,
        phone: companyInfo.phone,
        address: companyInfo.address,
        website: companyInfo.website,
        description: companyInfo.description,
        logo_url: logoUrl,
        updated_at: new Date().toISOString()
      };

      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your-supabase-url' || 
          supabaseKey === 'your-supabase-anon-key') {
        // Fallback to localStorage
        localStorage.setItem('company_info', JSON.stringify({
          name: companyInfo.name,
          abn: companyInfo.abn,
          email: companyInfo.email,
          phone: companyInfo.phone,
          address: companyInfo.address,
          website: companyInfo.website,
          description: companyInfo.description,
          logoUrl: logoUrl,
          updated_at: new Date().toISOString()
        }));
        
        setCompanyInfo(prev => ({ ...prev, logo: null, logoUrl: logoUrl || '' }));
        
        toast({
          title: 'Success',
          description: 'Company information saved locally. Configure Supabase for persistent storage.',
        });
        return;
      }

      const { error } = await supabase
        .from('company_info')
        .upsert(dataToSave);

      if (error) {
        throw error;
      }

      setCompanyInfo(prev => ({ ...prev, logo: null, logoUrl: logoUrl || '' }));
      
      toast({
        title: 'Success',
        description: 'Company information saved successfully',
      });
    } catch (error) {
      console.error('Error saving company info:', error);
      
      // Fallback to localStorage on error
      const fallbackData = {
        name: companyInfo.name,
        abn: companyInfo.abn,
        email: companyInfo.email,
        phone: companyInfo.phone,
        address: companyInfo.address,
        website: companyInfo.website,
        description: companyInfo.description,
        logoUrl: companyInfo.logoUrl,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('company_info', JSON.stringify(fallbackData));
      
      toast({
        title: 'Saved Locally',
        description: 'Company information saved to local storage. Database connection failed.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsPageTemplate 
      title="Company Information" 
      icon={<Building className="h-7 w-7 text-gray-700" />}
    >
      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>
              Manage your company details and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Supabase Configuration Alert */}
            {!isSupabaseConfigured && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Database Configuration Required</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>
                    Your data is being saved locally. To enable persistent storage and logo uploads, 
                    please configure Supabase in your .env file with valid VITE_SUPABASE_URL and 
                    VITE_SUPABASE_ANON_KEY values.
                  </p>
                  <p className="text-sm">
                    📖 <strong>Need help?</strong> Check the{' '}
                    <a 
                      href="/docs/SUPABASE_SETUP.md" 
                      target="_blank" 
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Supabase Setup Guide
                    </a>{' '}
                    for detailed instructions.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="abn">ABN</Label>
                <Input
                  id="abn"
                  value={companyInfo.abn}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, abn: e.target.value }))}
                  placeholder="Enter ABN"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={companyInfo.website}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="Enter website URL"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter company address"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={companyInfo.description}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter company description"
                rows={3}
              />
            </div>

                         <Separator />

             {/* Company Logo Section */}
             <CompanyLogoUpload
               logo={companyInfo.logo}
               logoUrl={companyInfo.logoUrl}
               onFileUpload={(file) => setCompanyInfo(prev => ({ ...prev, logo: file }))}
               onRemove={() => setCompanyInfo(prev => ({ ...prev, logo: null, logoUrl: '' }))}
             />

             <Separator />

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveCompanyInfo}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsPageTemplate>
  );
} 