import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./FileUpload";
import { ImagesGrid } from "./ImagesGrid";
import { AIContentEditor } from "./AIContentEditor";
import { VideoEditor } from "./VideoEditor";
import { useState } from "react";
interface PostContent {
  text: string;
  images: string[];
}
interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  connected: boolean;
}
interface AIEditingOptions {
  tone: string;
  length: string;
}
interface CreatePostCardProps {
  accounts: SocialAccount[];
  selectedPlatforms: string[];
  onPlatformSelect: (platforms: string[]) => void;
  postContent: PostContent;
  onPostContentChange: (content: PostContent) => void;
  onPost: () => void;
  isEditing: boolean;
  editingOptions: AIEditingOptions;
  onEditingOptionsChange: (options: AIEditingOptions) => void;
  onAIEnhance: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export function CreatePostCard({
  accounts,
  selectedPlatforms,
  onPlatformSelect,
  postContent,
  onPostContentChange,
  onPost,
  isEditing,
  editingOptions,
  onEditingOptionsChange,
  onAIEnhance,
  onFileUpload
}: CreatePostCardProps) {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setSelectedVideo(files[0]);
    }
  };
  const handleVideoEdit = () => {
    const clipchampUrl = `https://clipchamp.com/en/video-editor?source=embed&video=${encodeURIComponent(selectedVideo?.name || '')}`;
    window.open(clipchampUrl, '_blank', 'width=1200,height=800');
  };
  return <Card>
      <CardHeader className="bg-slate-200">
        <CardTitle>Create Post</CardTitle>
        <CardDescription>Share content across multiple platforms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 bg-slate-200">
        <div className="space-y-2">
          <Label>Select Platforms</Label>
          <div className="flex flex-wrap gap-2">
            {accounts.filter(a => a.connected).map(account => <div key={account.id} className="flex items-center space-x-2">
                <Checkbox id={account.id} checked={selectedPlatforms.includes(account.id)} onCheckedChange={checked => {
              if (checked) {
                onPlatformSelect([...selectedPlatforms, account.id]);
              } else {
                onPlatformSelect(selectedPlatforms.filter(id => id !== account.id));
              }
            }} />
                <Label htmlFor={account.id}>{account.platform}</Label>
              </div>)}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Post Content</Label>
            <Textarea placeholder="What would you like to share?" value={postContent.text} onChange={e => onPostContentChange({
            ...postContent,
            text: e.target.value
          })} className="min-h-[100px]" />
          </div>

          <AIContentEditor options={editingOptions} onOptionsChange={onEditingOptionsChange} onEnhance={onAIEnhance} isEditing={isEditing} disabled={!postContent.text} />

          <VideoEditor onVideoSelect={handleVideoSelect} onEdit={handleVideoEdit} disabled={!selectedVideo} selectedVideo={selectedVideo} />

          <div className="space-y-2">
            <Label>Add Media</Label>
            <FileUpload onFileUpload={onFileUpload} label="Upload Images" />
          </div>

          <ImagesGrid images={postContent.images} title="Selected Images" />

          <Button onClick={onPost} disabled={!postContent.text && postContent.images.length === 0 || selectedPlatforms.length === 0} className="w-full bg-slate-400 hover:bg-slate-300">
            Post to Selected Platforms
          </Button>
        </div>
      </CardContent>
    </Card>;
}