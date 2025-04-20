import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Mail, MessageSquare, Share2, Check, Upload, Image, Search, Share, Smartphone, Copy, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';
import { customerService } from '@/services/CustomerService';
import { useToast } from '@/hooks/use-toast';

interface Photo {
  id: string;
  url: string;
  selected?: boolean;
  caption?: string;
}

interface PhotoSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSource: 'job' | 'customer';
  jobId?: string;
  customerId?: string;
}

export function PhotoSharingModal({
  isOpen,
  onClose,
  initialSource = 'customer',
  jobId,
  customerId
}: PhotoSharingModalProps) {
  const [activeTab, setActiveTab] = useState<string>('email');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [shareLinkCopied, setShareLinkCopied] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Load photos when modal opens
  useEffect(() => {
    if (isOpen && (jobId || customerId)) {
      loadPhotos();
    }
  }, [isOpen, jobId, customerId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('email');
      setSelectedPhotos([]);
      setSending(false);
      setShareLinkCopied(false);
    }
  }, [isOpen]);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      let photosData: Photo[] = [];
      
      if (customerId) {
        // Get customer photos from service
        const journey = await customerService.getCustomerJourney(customerId);
        // Get photos for each audit
        const auditPhotos: Photo[] = [];
        for (const audit of journey.audits) {
          const photos = await customerService.getAuditPhotos(audit.id);
          const mappedPhotos = photos.map(photo => ({
            id: photo.id,
            url: photo.photo_url,
            caption: photo.caption || undefined,
            selected: false
          }));
          auditPhotos.push(...mappedPhotos);
        }
        photosData = auditPhotos;
      } else if (jobId) {
        // Mock job photos for now
        photosData = [
          { id: '1', url: 'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8', selected: false },
          { id: '2', url: 'https://images.unsplash.com/photo-1601158935942-52255782d322', selected: false },
          { id: '3', url: 'https://images.unsplash.com/photo-1463740839922-2d3b7e426a56', selected: false }
        ];
      }
      
      setPhotos(photosData);
    } catch (error) {
      console.error('Error loading photos:', error);
      toast({
        title: "Error",
        description: "Could not load photos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === photoId 
          ? { ...photo, selected: !photo.selected } 
          : photo
      )
    );
    
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });
  };

  const handleSelectAll = () => {
    const allSelected = photos.every(photo => photo.selected);
    
    if (allSelected) {
      // Deselect all
      setPhotos(prev => prev.map(photo => ({ ...photo, selected: false })));
      setSelectedPhotos([]);
    } else {
      // Select all
      setPhotos(prev => prev.map(photo => ({ ...photo, selected: true })));
      setSelectedPhotos(photos.map(photo => photo.id));
    }
  };

  const handleShare = async () => {
    if (selectedPhotos.length === 0) {
      toast({
        title: "No Photos Selected",
        description: "Please select at least one photo to share",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success",
        description: `Photos shared successfully via ${activeTab}`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error sharing photos:', error);
      toast({
        title: "Error",
        description: `Failed to share photos via ${activeTab}`,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const copyShareLink = () => {
    // In a real app, this would generate an actual sharing link
    const shareLink = `https://tradeease.example.com/share/${customerId || jobId}`;
    navigator.clipboard.writeText(shareLink);
    setShareLinkCopied(true);
    
    toast({
      title: "Link Copied",
      description: "Sharing link copied to clipboard",
    });
    
    setTimeout(() => setShareLinkCopied(false), 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`max-w-3xl h-[90vh] flex flex-col ${isMobile ? 'p-3' : ''}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share Photos
          </DialogTitle>
          <DialogDescription>
            Select photos and choose how to share them
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="mb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="email">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="sms">
                    <Smartphone className="h-4 w-4 mr-1" />
                    SMS
                  </TabsTrigger>
                  <TabsTrigger value="link">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Link
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto border rounded-md p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : photos.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">Select Photos to Share</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      {photos.every(p => p.selected) ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {photos.map(photo => (
                      <div 
                        key={photo.id}
                        className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                          photo.selected ? 'border-blue-500' : 'border-transparent'
                        }`}
                        onClick={() => togglePhotoSelection(photo.id)}
                      >
                        <img 
                          src={photo.url} 
                          alt={photo.caption || "Project photo"} 
                          className="w-full h-full object-cover"
                        />
                        {photo.selected && (
                          <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Image className="h-12 w-12 text-gray-400 mb-2" />
                  <p>No photos found</p>
                  <p className="text-sm text-gray-500">Try a different search or source</p>
                </div>
              )}
            </div>

            <div className="mt-3 text-sm text-gray-500">
              {selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''} selected
            </div>
          </div>

          <div className="w-full md:w-64 flex flex-col">
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="font-medium">Share Options</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shareMethod">Share Method</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={activeTab === 'email' ? 'default' : 'outline'}
                      className="flex flex-col items-center justify-center h-16 px-1 py-2"
                      onClick={() => setActiveTab('email')}
                    >
                      <Mail className="h-5 w-5 mb-1" />
                      <span className="text-xs">Email</span>
                    </Button>
                    <Button
                      type="button"
                      variant={activeTab === 'sms' ? 'default' : 'outline'}
                      className="flex flex-col items-center justify-center h-16 px-1 py-2"
                      onClick={() => setActiveTab('sms')}
                    >
                      <Smartphone className="h-5 w-5 mb-1" />
                      <span className="text-xs">SMS</span>
                    </Button>
                    <Button
                      type="button"
                      variant={activeTab === 'link' ? 'default' : 'outline'}
                      className="flex flex-col items-center justify-center h-16 px-1 py-2"
                      onClick={() => setActiveTab('link')}
                    >
                      <Copy className="h-5 w-5 mb-1" />
                      <span className="text-xs">Copy Link</span>
                    </Button>
                  </div>
                </div>

                {activeTab === 'email' && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Recipient Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}

                {activeTab === 'sms' && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Recipient Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                )}

                {activeTab === 'link' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Generate a link that can be shared with your customer. The link will expire in 7 days.
                    </p>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={copyShareLink}
                    >
                      {shareLinkCopied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Link Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy Sharing Link
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare} 
            disabled={selectedPhotos.length === 0 || sending}
            className="ml-2"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Share className="h-4 w-4 mr-1" />
                {activeTab === 'email' ? 'Send Email' : activeTab === 'sms' ? 'Send SMS' : 'Share'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
