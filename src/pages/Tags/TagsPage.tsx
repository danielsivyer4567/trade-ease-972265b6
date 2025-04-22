import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Tag as TagIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import TagCreator from '@/components/tags/TagCreator';
import DrawingTools from '@/components/tags/DrawingTools';

interface TagItem {
  id: string;
  name: string;
  description?: string;
  color: string;
  visibleTo: 'everyone' | 'team' | 'me';
  drawing?: string;
  createdAt: string;
}

const TagsPage: React.FC = () => {
  const [isTagCreatorOpen, setIsTagCreatorOpen] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawing, setDrawing] = useState<string | undefined>(undefined);
  const [tagDropActive, setTagDropActive] = useState(false);
  const [tags, setTags] = useState<TagItem[]>([
    {
      id: '1',
      name: 'Important',
      description: 'High priority items that need immediate attention',
      color: 'bg-red-500',
      visibleTo: 'everyone',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'In Progress',
      description: 'Tasks currently being worked on',
      color: 'bg-blue-500',
      visibleTo: 'everyone',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Pending Approval',
      description: 'Items waiting for client or manager approval',
      color: 'bg-yellow-500',
      visibleTo: 'team',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateTag = (tagData: any) => {
    const newTag: TagItem = {
      id: Date.now().toString(),
      name: tagData.name,
      description: tagData.description,
      color: tagData.color,
      visibleTo: tagData.visibleTo,
      drawing: tagData.drawing,
      createdAt: new Date().toISOString(),
    };
    
    setTags((prevTags) => [...prevTags, newTag]);
  };

  const handleSaveDrawing = (dataUrl: string) => {
    setDrawing(dataUrl);
    setIsDrawingMode(false);
    // Here you would typically handle the creation or placement of the tag based on the drawing
  };

  const activateTagDrop = () => {
    setTagDropActive(true);
    setIsDrawingMode(true);
  };

  const cancelTagDrop = () => {
    setTagDropActive(false);
    setIsDrawingMode(false);
  };

  const filteredTags = tags.filter((tag) => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tag.description && tag.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getColorHex = (colorClass: string) => {
    const colorMap: Record<string, string> = {
      'bg-red-500': '#ef4444',
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#22c55e',
      'bg-yellow-500': '#eab308',
      'bg-purple-500': '#a855f7',
      'bg-pink-500': '#ec4899',
      'bg-orange-500': '#f97316',
      'bg-teal-500': '#14b8a6',
    };
    
    return colorMap[colorClass] || '#3b82f6';
  };

  return (
    <div className="container mx-auto py-6 space-y-6 relative">
      {/* Tag drop notification bar */}
      {tagDropActive && (
        <div className="fixed top-0 left-0 right-0 bg-background z-50 border-b p-2 flex justify-between items-center">
          <div className="flex items-center">
            <TagIcon className="h-4 w-4 mr-2 text-primary" />
            <span>Tag Drop</span>
            <span className="ml-2 text-sm text-muted-foreground">Click anywhere on the page to place a tag.</span>
          </div>
          <Button variant="destructive" size="sm" onClick={cancelTagDrop}>
            Cancel Tag Drop
          </Button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tags</h1>
        <div className="flex space-x-2">
          <Button onClick={activateTagDrop} variant="outline">
            <TagIcon className="mr-2 h-4 w-4" />
            Create Tag Outside
          </Button>
          <Button onClick={() => setIsTagCreatorOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Tag
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tags..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTags.map((tag) => (
          <div 
            key={tag.id} 
            className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              {tag.drawing ? (
                <img src={tag.drawing} alt={tag.name} className="h-8 w-8 object-contain" />
              ) : (
                <div className="flex items-center justify-center h-8 w-8 rounded-full" style={{ backgroundColor: getColorHex(tag.color) }}>
                  <TagIcon className="h-4 w-4 text-white" />
                </div>
              )}
              <h3 className="font-medium text-lg">{tag.name}</h3>
            </div>
            
            {tag.description && (
              <p className="text-muted-foreground text-sm mb-3">{tag.description}</p>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Visible to: {tag.visibleTo === 'everyone' ? 'Everyone' : tag.visibleTo === 'team' ? 'Team' : 'Only me'}
              </span>
              <span>
                {new Date(tag.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        
        {filteredTags.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {searchQuery ? 'No tags found matching your search.' : 'No tags created yet. Click "New Tag" to get started.'}
          </div>
        )}
      </div>
      
      <TagCreator
        isOpen={isTagCreatorOpen}
        onClose={() => setIsTagCreatorOpen(false)}
        onCreateTag={handleCreateTag}
        onRequestExternalDrawing={activateTagDrop}
      />

      {/* Outside drawing mode */}
      {isDrawingMode && (
        <div className="fixed inset-0 bg-black/10 z-40 flex items-center justify-center">
          <div className="absolute w-96 z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="p-4 bg-background border rounded-lg shadow-lg">
              <DrawingTools
                onSaveDrawing={handleSaveDrawing}
                onCancel={cancelTagDrop}
              />
              <div className="mt-4 flex justify-center gap-4">
                <Button variant="outline" onClick={cancelTagDrop}>Cancel</Button>
                <Button variant="default" onClick={() => handleSaveDrawing(drawing || '')}>Done</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsPage; 