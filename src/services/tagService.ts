import { supabase } from '@/integrations/supabase/client';

export interface TagData {
  id: string;
  creatorId: string;
  comment: string;
  taggedStaffIds: string[];
  attachments: Array<{
    type: 'image' | 'audio' | 'drawing';
    url: string;
  }>;
  coords: {
    x: number;
    y: number;
  };
  timestamp: number;
  drawingData?: string;
}

export async function fetchTagData(tagId: string): Promise<TagData> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('id', tagId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch tag data: ${error.message}`);
  }

  return data;
}

export async function createTag(tagData: Omit<TagData, 'id' | 'timestamp'>): Promise<TagData> {
  const { data, error } = await supabase
    .from('tags')
    .insert([{
      ...tagData,
      timestamp: Date.now()
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create tag: ${error.message}`);
  }

  return data;
}

export async function addTagReply(tagId: string, reply: { userId: string; content: string }) {
  const { error } = await supabase
    .from('tag_replies')
    .insert([{
      tag_id: tagId,
      user_id: reply.userId,
      content: reply.content,
      timestamp: Date.now()
    }]);

  if (error) {
    throw new Error(`Failed to add reply: ${error.message}`);
  }
}

export async function getTagReplies(tagId: string) {
  const { data, error } = await supabase
    .from('tag_replies')
    .select('*')
    .eq('tag_id', tagId)
    .order('timestamp', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch replies: ${error.message}`);
  }

  return data;
} 