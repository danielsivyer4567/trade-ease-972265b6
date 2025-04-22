import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TagCreator } from './TagCreator';
import { Tag, AlignJustify, Clock, Plus, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface TagData {
  id: string;
  staff: string[];
  createdAt: string;
  attachments: string[];
}

interface TagsListProps {
  jobId?: string;
  customerId?: string;
  className?: string;
}

const mockTags: TagData[] = [
  {
    id: '1',
    staff: ['1', '2'],
    createdAt: '2023-08-15T14:30:00Z',
    attachments: ['/tags/sample-tag1.png']
  },
  {
    id: '2',
    staff: ['1'],
    createdAt: '2023-08-14T10:15:00Z',
    attachments: ['/tags/sample-tag2.png']
  }
];

const mockStaff = [
  { id: '1', name: 'Alice', avatar: '/avatars/alice.png' },
  { id: '2', name: 'Bob', avatar: '/avatars/bob.png' },
  { id: '3', name: 'Charlie', avatar: '/avatars/charlie.png' }
];

export const TagsList: React.FC<TagsListProps> = ({
  jobId,
  customerId,
  className
}) => {
  const [tags, setTags] = useState<TagData[]>(mockTags);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const handleAddTag = (newTag: TagData) => {
    setTags(prev => [newTag, ...prev]);
    setIsCreateDialogOpen(false);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  const getStaffName = (staffId: string) => {
    const staff = mockStaff.find(s => s.id === staffId);
    return staff?.name || 'Unknown';
  };
  
  const getStaffAvatar = (staffId: string) => {
    const staff = mockStaff.find(s => s.id === staffId);
    return staff?.avatar || '';
  };
  
  const getStaffInitials = (staffId: string) => {
    const name = getStaffName(staffId);
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Tags</CardTitle>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                Add Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg p-0">
              <TagCreator 
                onClose={() => setIsCreateDialogOpen(false)}
                onSave={handleAddTag}
                staff={mockStaff}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {tags.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Tag className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p>No tags created yet</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Create Your First Tag
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tags.map((tag) => (
              <div 
                key={tag.id} 
                className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {tag.staff.map((staffId) => (
                        <Avatar key={staffId} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={getStaffAvatar(staffId)} alt={getStaffName(staffId)} />
                          <AvatarFallback>{getStaffInitials(staffId)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {tag.staff.map(staffId => getStaffName(staffId)).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1 opacity-70" />
                    <span>{formatDate(tag.createdAt)}</span>
                  </div>
                </div>
                
                {tag.attachments.length > 0 && (
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {tag.attachments.map((attachment, idx) => {
                      if (attachment.startsWith('data:image') || attachment.endsWith('.png') || attachment.endsWith('.jpg') || attachment.endsWith('.jpeg')) {
                        return (
                          <img 
                            key={idx} 
                            src={attachment} 
                            alt={`Tag attachment ${idx + 1}`}
                            className="w-full h-auto rounded border object-cover"
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TagsList; 