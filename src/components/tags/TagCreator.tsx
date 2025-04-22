import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlusCircle, Image } from 'lucide-react';
import DrawingTools from './DrawingTools';

const tagSchema = z.object({
  name: z.string().min(2, { message: 'Tag name must be at least 2 characters' }),
  description: z.string().optional(),
  color: z.string(),
  visibleTo: z.enum(['everyone', 'team', 'me']),
});

type TagFormValues = z.infer<typeof tagSchema>;

export interface TagCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTag: (tagData: TagFormValues & { drawing?: string }) => void;
}

const predefinedColors = [
  { value: 'bg-red-500', label: 'Red', hex: '#ef4444' },
  { value: 'bg-blue-500', label: 'Blue', hex: '#3b82f6' },
  { value: 'bg-green-500', label: 'Green', hex: '#22c55e' },
  { value: 'bg-yellow-500', label: 'Yellow', hex: '#eab308' },
  { value: 'bg-purple-500', label: 'Purple', hex: '#a855f7' },
  { value: 'bg-pink-500', label: 'Pink', hex: '#ec4899' },
  { value: 'bg-orange-500', label: 'Orange', hex: '#f97316' },
  { value: 'bg-teal-500', label: 'Teal', hex: '#14b8a6' },
];

export const TagCreator: React.FC<TagCreatorProps> = ({
  isOpen,
  onClose,
  onCreateTag,
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [drawing, setDrawing] = useState<string | undefined>(undefined);
  const [showDrawingTools, setShowDrawingTools] = useState(false);

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
      description: '',
      color: 'bg-blue-500',
      visibleTo: 'everyone',
    },
  });

  const onSubmit = (data: TagFormValues) => {
    onCreateTag({ ...data, drawing });
    form.reset();
    setDrawing(undefined);
    onClose();
  };

  const handleSaveDrawing = (dataUrl: string) => {
    setDrawing(dataUrl);
    setShowDrawingTools(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Tag</DialogTitle>
          <DialogDescription>
            Tags help you organize and categorize items in your workflow.
          </DialogDescription>
        </DialogHeader>

        {showDrawingTools ? (
          <DrawingTools 
            onSaveDrawing={handleSaveDrawing} 
            onCancel={() => setShowDrawingTools(false)}
            initialImage={drawing}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Tag Details</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="details" className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tag name..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of this tag..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Explain what this tag represents or how it should be used.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="visibleTo"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Visibility</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="everyone" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Visible to everyone
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="team" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Visible to my team only
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="me" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Private (only me)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="appearance" className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag Color</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-4 gap-2 pt-2"
                          >
                            {predefinedColors.map((colorOption) => (
                              <FormItem key={colorOption.value} className="flex flex-col items-center space-y-2">
                                <FormControl>
                                  <RadioGroupItem
                                    value={colorOption.value}
                                    id={colorOption.value}
                                    className="sr-only"
                                  />
                                </FormControl>
                                <label
                                  htmlFor={colorOption.value}
                                  className={`h-10 w-10 rounded-full cursor-pointer flex items-center justify-center border-2 ${
                                    field.value === colorOption.value
                                      ? 'border-black'
                                      : 'border-transparent'
                                  }`}
                                  style={{ backgroundColor: colorOption.hex }}
                                >
                                  {field.value === colorOption.value && (
                                    <div className="h-2 w-2 rounded-full bg-white" />
                                  )}
                                </label>
                                <span className="text-xs">{colorOption.label}</span>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormLabel>Custom Icon (Optional)</FormLabel>
                    <div className="flex items-center gap-4">
                      {drawing ? (
                        <div className="relative border rounded-md overflow-hidden h-24 w-24">
                          <img 
                            src={drawing} 
                            alt="Tag icon" 
                            className="object-contain h-full w-full" 
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-1 right-1 h-7 w-7 p-0"
                            onClick={() => setShowDrawingTools(true)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="h-24 w-24 flex flex-col gap-1"
                          onClick={() => setShowDrawingTools(true)}
                        >
                          <Image className="h-6 w-6" />
                          <span className="text-xs">Add Icon</span>
                        </Button>
                      )}
                      <div className="text-sm text-muted-foreground">
                        <p>Create a custom icon for this tag using our drawing tools.</p>
                        <p>This helps make your tags more distinguishable.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Tag</Button>
                </DialogFooter>
              </form>
            </Form>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TagCreator; 