
import { TagData, Attachment, StaffMember, CommentHistoryItem } from '../types';
import { CURRENT_USER_ID, CURRENT_USER_NAME } from '../constants';

let tags: TagData[] = [];

export const uploadFileToSupabase = async (file: File, folder: string, fileName: string): Promise<string> => {
  console.log(`[Mock] Uploading ${fileName} to Supabase folder: ${folder}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  const mockUrl = `https://mock-supabase.com/${folder}/${fileName}?t=${Date.now()}`;
  console.log(`[Mock] Uploaded to: ${mockUrl}`);
  return mockUrl;
};

export const createTag = async (tagDetails: Omit<TagData, 'id' | 'timestamp' | 'creatorName' | 'pageUrl' | 'currentCommentAuthorId' | 'currentCommentAuthorName' | 'currentCommentTimestamp' | 'commentHistory'>): Promise<TagData> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newTag: TagData = {
    ...tagDetails,
    id: `tag_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    timestamp: Date.now(), // Original creation timestamp
    creatorId: CURRENT_USER_ID, // Original creator
    creatorName: CURRENT_USER_NAME, // Original creator
    pageUrl: window.location.href,
    currentCommentAuthorId: CURRENT_USER_ID, // Initially, creator is author of main comment
    currentCommentAuthorName: CURRENT_USER_NAME,
    currentCommentTimestamp: Date.now(), // Timestamp of the main comment
    commentHistory: [], // No history initially
  };
  tags.push(newTag);
  console.log('[tagService] Created tag:', newTag);
  return newTag;
};

export const getTagById = async (tagId: string): Promise<TagData | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return tags.find(tag => tag.id === tagId);
};

export const getAllTags = async (): Promise<TagData[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...tags];
};

export const updateTagWithNewComment = async (tagId: string, newCommentText: string, authorId: string, authorName: string): Promise<TagData | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const tagIndex = tags.findIndex(t => t.id === tagId);
  if (tagIndex === -1) return null;

  const currentTag = tags[tagIndex];

  // Add current main comment to history
  const oldCommentToHistory: CommentHistoryItem = {
    text: currentTag.comment,
    authorId: currentTag.currentCommentAuthorId,
    authorName: currentTag.currentCommentAuthorName,
    timestamp: currentTag.currentCommentTimestamp,
  };
  
  // Prepend to history to keep it sorted with newest history item first (optional, depends on display preference)
  const updatedHistory = [oldCommentToHistory, ...currentTag.commentHistory]; 

  // Update tag with new main comment
  tags[tagIndex] = {
    ...currentTag,
    comment: newCommentText,
    currentCommentAuthorId: authorId,
    currentCommentAuthorName: authorName,
    currentCommentTimestamp: Date.now(),
    commentHistory: updatedHistory,
  };

  console.log('[tagService] Updated tag with new comment:', tagId, tags[tagIndex]);
  return { ...tags[tagIndex] };
};


// Initialize with some mock data for development
const initializeMockTags = () => {
  if (tags.length === 0) {
    const mockAttachmentDrawing: Attachment = {
      id: 'attach_drawing_1', type: 'drawing', url: 'https://picsum.photos/seed/drawing_attach/200/150', fileName: 'annotation.png', previewUrl: 'https://picsum.photos/seed/drawing_attach_preview/200/150',
    };
    const mockAttachmentImage: Attachment = {
      id: 'attach_image_1', type: 'image', url: 'https://picsum.photos/seed/img_attach/400/300', fileName: 'context-image.jpg', previewUrl: 'https://picsum.photos/seed/img_attach_preview/200/150',
    };

    tags.push({
      id: 'tag_example_1',
      creatorId: 'staff_1',
      creatorName: 'Alice Wonderland',
      pageUrl: window.location.href,
      coords: { x: 200, y: 300 },
      comment: "Good catch, I'll look into it.", // Bob's reply is now the main comment
      currentCommentAuthorId: 'staff_2',
      currentCommentAuthorName: 'Bob The Builder',
      currentCommentTimestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
      taggedStaffIds: ['staff_2', CURRENT_USER_ID],
      attachments: [], // Removed mockAttachmentDrawing for clarity, can be re-added
      drawingDataUrl: 'https://via.placeholder.com/300x200.png/007bff/ffffff?text=Alice%27s+Drawing', // Example main drawing
      timestamp: Date.now() - 1000 * 60 * 60 * 2, // Tag created 2 hours ago
      commentHistory: [
        { text: 'Check this section for clarity. The font seems a bit off.', authorId: 'staff_1', authorName: 'Alice Wonderland', timestamp: Date.now() - 1000 * 60 * 60 * 2 }
      ],
    });
    tags.push({
      id: 'tag_example_2',
      creatorId: CURRENT_USER_ID,
      creatorName: CURRENT_USER_NAME,
      pageUrl: window.location.href,
      coords: { x: 500, y: 150 },
      comment: 'This button needs a different color. @Alice Wonderland can you advise?',
      currentCommentAuthorId: CURRENT_USER_ID,
      currentCommentAuthorName: CURRENT_USER_NAME,
      currentCommentTimestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
      taggedStaffIds: ['staff_1'],
      attachments: [mockAttachmentImage],
      drawingDataUrl: undefined, // No main drawing for this one
      timestamp: Date.now() - 1000 * 60 * 60 * 5,
      commentHistory: [],
    });
  }
};

initializeMockTags();
