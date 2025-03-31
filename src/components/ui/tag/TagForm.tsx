
import React, { useState } from 'react';
import { X, Upload, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember, TagFormData } from './types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TagFormProps {
  position: { x: number; y: number };
  user: TeamMember | null;
  onSubmit: (data: TagFormData) => void;
  onCancel: () => void;
}

export function TagForm({ position, user, onSubmit, onCancel }: TagFormProps) {
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      comment,
      imageFile
    });
  };

  return (
    <Card className={cn(
      "fixed z-50 shadow-lg w-80",
      "animate-in zoom-in-95 duration-200"
    )} 
      style={{ 
        top: position.y + 10, 
        left: position.x + 10, 
        transform: 'translateX(-50%)',
      }}
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Tag {user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Input 
              id="comment" 
              placeholder="Add a comment..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="image">Attach Image (Optional)</Label>
              <Label 
                htmlFor="image" 
                className="cursor-pointer text-xs text-blue-500 hover:text-blue-700"
              >
                Browse
              </Label>
            </div>
            <Input 
              id="image" 
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={handleImageChange}
            />
            
            {!imagePreview ? (
              <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => document.getElementById('image')?.click()}>
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Click to upload an image</span>
              </div>
            ) : (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-md max-h-40 object-cover" />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">
              <Send className="h-4 w-4 mr-1" /> Tag User
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
