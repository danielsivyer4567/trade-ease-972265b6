
import { AppLayout } from "@/components/ui/AppLayout";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SocialAccountCard } from "@/components/tasks/SocialAccountCard";
import { CreatePostCard } from "@/components/tasks/CreatePostCard";

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

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Social Media Management</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <SocialAccountCard
            accounts={accounts}
            onConnect={handleConnect}
          />

          <CreatePostCard
            accounts={accounts}
            selectedPlatforms={selectedPlatforms}
            onPlatformSelect={setSelectedPlatforms}
            postContent={postContent}
            onPostContentChange={setPostContent}
            onPost={handlePost}
            isEditing={isEditing}
            editingOptions={editingOptions}
            onEditingOptionsChange={setEditingOptions}
            onAIEnhance={handleAIEdit}
            onFileUpload={handleFileUpload}
          />
        </div>
      </div>
    </AppLayout>
  );
}
