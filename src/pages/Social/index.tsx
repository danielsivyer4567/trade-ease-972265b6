import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { useState } from "react";
import { Facebook, Instagram, Youtube, Store, Check, Plus, Sparkles, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  connected: boolean;
}

interface PostContent {
  text: string;
  images: string[];
}

interface AIEditingOptions {
  tone: string;
  length: string;
}

export default function Social() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    { id: '1', platform: 'Facebook', username: '', connected: false },
    { id: '2', platform: 'Instagram', username: '', connected: false },
    { id: '3', platform: 'TikTok', username: '', connected: false },
    { id: '4', platform: 'Google Business', username: '', connected: false },
  ]);

  const [postContent, setPostContent] = useState<PostContent>({
    text: '',
    images: [],
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingOptions, setEditingOptions] = useState<AIEditingOptions>({
    tone: 'professional',
    length: 'medium'
  });
  const { toast } = useToast();

  const handleConnect = (accountId: string) => {
    setAccounts(accounts.map(account => {
      if (account.id === accountId) {
        return { ...account, connected: !account.connected };
      }
      return account;
    }));

    toast({
      title: "Account Connected",
      description: "Social media account has been connected successfully.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setPostContent(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const handlePost = () => {
    if (!postContent.text && postContent.images.length === 0) {
      toast({
        title: "Error",
        description: "Please add some content or images to post.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform to post to.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Content Posted",
      description: "Your content has been scheduled for posting.",
    });

    setPostContent({ text: '', images: [] });
    setSelectedPlatforms([]);
  };

  const handleAIEdit = async () => {
    if (!postContent.text) {
      toast({
        title: "Error",
        description: "Please add some content to edit.",
        variant: "destructive",
      });
      return;
    }

    setIsEditing(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-with-openai', {
        body: {
          prompt: `Edit the following social media post with a ${editingOptions.tone} tone and make it ${editingOptions.length} length: ${postContent.text}`,
        },
      });

      if (error) throw error;

      setPostContent(prev => ({
        ...prev,
        text: data.generatedText,
      }));

      toast({
        title: "Content Edited",
        description: "Your content has been enhanced by AI.",
      });
    } catch (error) {
      console.error('Error editing content:', error);
      toast({
        title: "Error",
        description: "Failed to edit content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook':
        return <Facebook className="h-5 w-5" />;
      case 'Instagram':
        return <Instagram className="h-5 w-5" />;
      case 'TikTok':
        return <Youtube className="h-5 w-5" />;
      case 'Google Business':
        return <Store className="h-5 w-5" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Social Media Management</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Link your social media accounts to post content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {accounts.map(account => (
                <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(account.platform)}
                    <div>
                      <p className="font-medium">{account.platform}</p>
                      {account.connected && (
                        <p className="text-sm text-gray-500">Connected</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={account.connected ? "outline" : "default"}
                    onClick={() => handleConnect(account.id)}
                  >
                    {account.connected ? (
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Connected
                      </span>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Post</CardTitle>
              <CardDescription>Share content across multiple platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Platforms</Label>
                <div className="flex flex-wrap gap-2">
                  {accounts.filter(a => a.connected).map(account => (
                    <div key={account.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={account.id}
                        checked={selectedPlatforms.includes(account.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPlatforms([...selectedPlatforms, account.id]);
                          } else {
                            setSelectedPlatforms(selectedPlatforms.filter(id => id !== account.id));
                          }
                        }}
                      />
                      <Label htmlFor={account.id}>{account.platform}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Post Content</Label>
                  <Textarea
                    placeholder="What would you like to share?"
                    value={postContent.text}
                    onChange={(e) => setPostContent({ ...postContent, text: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>

                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      AI Content Enhancement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tone</Label>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={editingOptions.tone}
                          onChange={(e) => setEditingOptions(prev => ({ ...prev, tone: e.target.value }))}
                        >
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                          <option value="friendly">Friendly</option>
                          <option value="formal">Formal</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Length</Label>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={editingOptions.length}
                          onChange={(e) => setEditingOptions(prev => ({ ...prev, length: e.target.value }))}
                        >
                          <option value="short">Short</option>
                          <option value="medium">Medium</option>
                          <option value="long">Long</option>
                        </select>
                      </div>
                    </div>
                    <Button
                      onClick={handleAIEdit}
                      variant="outline"
                      className="w-full"
                      disabled={isEditing || !postContent.text}
                    >
                      {isEditing ? (
                        "Enhancing content..."
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Enhance with AI
                        </span>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label>Add Media</Label>
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    label="Upload Images"
                  />
                </div>

                <ImagesGrid
                  images={postContent.images}
                  title="Selected Images"
                />

                <Button
                  onClick={handlePost}
                  className="w-full"
                  disabled={(!postContent.text && postContent.images.length === 0) || selectedPlatforms.length === 0}
                >
                  Post to Selected Platforms
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
