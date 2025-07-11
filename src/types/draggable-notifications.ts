// TypeScript types for the Draggable Notifications System
// This file defines types that match the Supabase database schema

export type TagApprovalStatus = 'pending' | 'approved' | 'rejected';
export type AttachmentType = 'image' | 'audio' | 'drawing' | 'video';
export type NotificationTypes = 'job' | 'quote' | 'payment' | 'message' | 'other' | 'tag' | 'comment' | 'team' | 'calendar' | 'account' | 'security';

// Database row types (as returned from Supabase)
export interface TagRow {
  id: string;
  creator_id: string;
  comment: string | null;
  tagged_staff_ids: string[];
  attachments: TagAttachment[];
  coords: TagCoordinates;
  timestamp: number;
  drawing_data: string | null;
  conversation_id: string | null;
  reply_to_id: string | null;
  requires_approval: boolean;
  approval_status: TagApprovalStatus;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TagReplyRow {
  id: string;
  tag_id: string;
  user_id: string;
  content: string;
  attachments: TagAttachment[];
  timestamp: number;
  created_at: string;
}

export interface StaffNotificationRow {
  id: string;
  tag_id: string;
  staff_id: string;
  notification_sent: boolean;
  notification_sent_at: string | null;
  read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface EnhancedNotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  read: boolean;
  read_at: string | null;
  created_at: string;
  sender_id: string | null;
  sender_name: string | null;
  sender_avatar: string | null;
  comment: string | null;
  media_type: AttachmentType | null;
  media_url: string | null;
  drawing_data: string | null;
  requires_approval: boolean;
  approval_status: TagApprovalStatus;
  approver_ids: string[];
  conversation_id: string | null;
  reply_count: number;
  coordinates: TagCoordinates | null;
  attachments: TagAttachment[];
  notification_type: NotificationTypes | null;
}

// Application types (for use in components)
export interface TagCoordinates {
  x: number;
  y: number;
}

export interface TagAttachment {
  type: AttachmentType;
  url: string;
  filename?: string;
  size?: number;
  mime_type?: string;
}

export interface StaffMember {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  first_name?: string;
  last_name?: string;
}

export interface TagData {
  id: string;
  creatorId: string;
  comment: string;
  taggedStaffIds: string[];
  attachments: TagAttachment[];
  coords: TagCoordinates;
  timestamp: number;
  drawingData?: string;
  conversationId?: string;
  replyToId?: string | number;
  requiresApproval?: boolean;
  approvalStatus?: TagApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagReply {
  id: string;
  tagId: string;
  userId: string;
  content: string;
  attachments: TagAttachment[];
  timestamp: number;
  createdAt: string;
  user?: StaffMember; // Populated via join
}

export interface TagWithDetails {
  id: string;
  creator_id: string;
  comment: string | null;
  tagged_staff_ids: string[];
  attachments: TagAttachment[];
  coords: TagCoordinates;
  timestamp: number;
  drawing_data: string | null;
  conversation_id: string | null;
  reply_to_id: string | null;
  requires_approval: boolean;
  approval_status: TagApprovalStatus;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  creator_email: string;
  creator_name: string;
  creator_avatar: string | null;
  reply_count: number;
  unread_count: number;
  tagged_staff_details: StaffMember[];
}

export interface CreateTagPayload {
  creatorId: string;
  comment: string;
  taggedStaffIds: string[];
  attachments: TagAttachment[];
  coords: TagCoordinates;
  drawingData?: string;
  conversationId?: string;
  replyToId?: string | number;
  requiresApproval?: boolean;
}

export interface CreateTagReplyPayload {
  tagId: string;
  userId: string;
  content: string;
  attachments?: TagAttachment[];
}

export interface UpdateTagPayload {
  comment?: string;
  taggedStaffIds?: string[];
  attachments?: TagAttachment[];
  drawingData?: string;
  requiresApproval?: boolean;
}

export interface TagFilters {
  creatorId?: string;
  taggedStaffId?: string;
  approvalStatus?: TagApprovalStatus;
  requiresApproval?: boolean;
  conversationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TagQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'updated_at' | 'timestamp';
  orderDirection?: 'asc' | 'desc';
  includeReplies?: boolean;
  includeStaffDetails?: boolean;
}

// Error types
export interface TagError {
  code: string;
  message: string;
  details?: any;
}

// API response types
export interface TagResponse {
  data: TagData | null;
  error: TagError | null;
}

export interface TagListResponse {
  data: TagData[];
  count: number;
  error: TagError | null;
}

export interface TagWithDetailsResponse {
  data: TagWithDetails | null;
  error: TagError | null;
}

// Upload types
export interface UploadedFile {
  file: File;
  previewUrl: string;
  type: AttachmentType;
  supabaseUrl?: string;
}

export interface FileUploadProgress {
  filename: string;
  progress: number;
  completed: boolean;
  error?: string;
}

// Notification enhancement types (extends existing notification interface)
export interface EnhancedNotification {
  id: string | number;
  type: NotificationTypes;
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
  initials?: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  comment?: string;
  mediaType?: AttachmentType;
  mediaUrl?: string;
  drawingData?: string;
  requiresApproval?: boolean;
  approvalStatus?: TagApprovalStatus;
  approverIds?: string[];
  conversationId?: string;
  replyCount?: number;
  coordinates?: TagCoordinates;
  attachments?: TagAttachment[];
}

// Drawing state types (already exists but included for completeness)
export interface DrawingState {
  isActive: boolean;
  tool: string;
  color: string;
  lineWidth: number;
  isDrawingOnPage: boolean;
}

// Component prop types
export interface DraggableNotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  businessLogoUrl?: string;
  currentUserId: string;
  availableStaff: StaffMember[];
}

// Hook return types
export interface UseTagsHook {
  tags: TagData[];
  loading: boolean;
  error: TagError | null;
  createTag: (payload: CreateTagPayload) => Promise<TagResponse>;
  updateTag: (id: string, payload: UpdateTagPayload) => Promise<TagResponse>;
  deleteTag: (id: string) => Promise<{ error: TagError | null }>;
  refreshTags: () => Promise<void>;
}

export interface UseTagRepliesHook {
  replies: TagReply[];
  loading: boolean;
  error: TagError | null;
  createReply: (payload: CreateTagReplyPayload) => Promise<{ data: TagReply | null; error: TagError | null }>;
  refreshReplies: () => Promise<void>;
}

// Constants
export const TAG_APPROVAL_STATUSES: TagApprovalStatus[] = ['pending', 'approved', 'rejected'];
export const ATTACHMENT_TYPES: AttachmentType[] = ['image', 'audio', 'drawing', 'video'];
export const NOTIFICATION_TYPES: NotificationTypes[] = [
  'job', 'quote', 'payment', 'message', 'other', 'tag', 'comment', 
  'team', 'calendar', 'account', 'security'
];

// Utility type for making all properties optional except specified ones
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Type guards
export const isTagAttachment = (obj: any): obj is TagAttachment => {
  return obj && typeof obj === 'object' && 
         'type' in obj && ATTACHMENT_TYPES.includes(obj.type) &&
         'url' in obj && typeof obj.url === 'string';
};

export const isTagCoordinates = (obj: any): obj is TagCoordinates => {
  return obj && typeof obj === 'object' &&
         'x' in obj && typeof obj.x === 'number' &&
         'y' in obj && typeof obj.y === 'number';
};

export const isValidApprovalStatus = (status: string): status is TagApprovalStatus => {
  return TAG_APPROVAL_STATUSES.includes(status as TagApprovalStatus);
};