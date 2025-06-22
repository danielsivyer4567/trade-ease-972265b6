
export interface Point {
  x: number;
  y: number;
}

export type DrawingTool = 'pencil' | 'eraser' | 'line' | 'arrow' | 'rectangle' | 'circle' | 'star' | 'text';

export interface DrawingState {
  tool: DrawingTool;
  color: string;
  lineWidth: number;
  isDrawingOnPage?: boolean; // Indicates if drawing is on full page overlay
}

export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'drawing';
  url: string; // URL after upload (e.g., to Supabase or data URL for local)
  fileName: string;
  previewUrl?: string; // For images or drawing previews
}

// CommentHistoryItem replaces the old Reply interface
export interface CommentHistoryItem {
  text: string;
  authorId: string;
  authorName: string;
  timestamp: number;
}

export interface TagData {
  id: string;
  creatorId: string; // Original creator of the tag
  creatorName: string; // Original creator's name

  pageUrl: string; // URL of the page where tag was placed
  coords: Point; // Relative to viewport when placed
  elementSelector?: string; // Optional: CSS selector for the tagged element
  
  comment: string; // The *current/latest* comment in the thread
  currentCommentAuthorId: string;
  currentCommentAuthorName: string;
  currentCommentTimestamp: number;
  
  taggedStaffIds: string[];
  attachments: Attachment[];
  drawingDataUrl?: string; // Data URL of the main visual annotation for hover preview
  
  timestamp: number; // Timestamp of original tag creation
  commentHistory: CommentHistoryItem[]; // History of previous comments
}

export interface StaffMember {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Notification {
  id: string;
  type: 'new_tag' | 'reply' | 'mention' | 'generic';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  tagId?: string; // To link notification to a specific tag
  link?: string; // Generic link
}

export type PanelSize = 'quarter' | 'half' | 'custom' | 'minimized';
export type ActiveTab = 'all' | 'tags' | 'mentions' | 'updates' | 'teams' | 'calendar' | 'comments';

export interface UploadedFile {
    id: string;
    file: File;
    previewUrl?: string; 
    type: 'image' | 'audio' | 'drawing';
    remoteUrl?: string; 
}

export declare const toast: {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

export type CnFunction = (...inputs: Array<string | undefined | null | Record<string, boolean>>) => string;
export const cn: CnFunction = (...inputs) => {
  return inputs
    .flat()
    .filter(x => x !== null && x !== undefined && typeof x !== 'boolean')
    .map(x => (typeof x === 'object' ? Object.keys(x).filter(k => x[k]) : [x]))
    .flat()
    .join(' ');
};

export type BusinessLogoUrl = string;

export interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
}
