// React hooks for the Draggable Notifications System

import { useState, useEffect, useCallback } from 'react';
import {
  fetchTags,
  fetchTag,
  fetchTagWithDetails,
  createTag,
  updateTag,
  deleteTag,
  updateTagApproval,
  fetchTagReplies,
  createTagReply,
  markStaffNotificationAsRead,
  fetchUnreadNotifications,
  uploadTagAttachment
} from '@/services/enhancedTagService';
import type {
  TagData,
  TagReply,
  TagWithDetails,
  CreateTagPayload,
  CreateTagReplyPayload,
  UpdateTagPayload,
  TagFilters,
  TagQueryOptions,
  TagError,
  UseTagsHook,
  UseTagRepliesHook,
  FileUploadProgress
} from '@/types/draggable-notifications';

/**
 * Hook for managing tags
 */
export function useTags(
  filters: TagFilters = {},
  options: TagQueryOptions = {}
): UseTagsHook {
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TagError | null>(null);

  const refreshTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await fetchTags(filters, options);
    
    if (response.error) {
      setError(response.error);
    } else {
      setTags(response.data);
    }
    
    setLoading(false);
  }, [filters, options]);

  const handleCreateTag = useCallback(async (payload: CreateTagPayload) => {
    const response = await createTag(payload);
    
    if (response.data && !response.error) {
      setTags(prev => [response.data!, ...prev]);
    }
    
    return response;
  }, []);

  const handleUpdateTag = useCallback(async (id: string, payload: UpdateTagPayload) => {
    const response = await updateTag(id, payload);
    
    if (response.data && !response.error) {
      setTags(prev => prev.map(tag => 
        tag.id === id ? response.data! : tag
      ));
    }
    
    return response;
  }, []);

  const handleDeleteTag = useCallback(async (id: string) => {
    const response = await deleteTag(id);
    
    if (!response.error) {
      setTags(prev => prev.filter(tag => tag.id !== id));
    }
    
    return response;
  }, []);

  useEffect(() => {
    refreshTags();
  }, [refreshTags]);

  return {
    tags,
    loading,
    error,
    createTag: handleCreateTag,
    updateTag: handleUpdateTag,
    deleteTag: handleDeleteTag,
    refreshTags
  };
}

/**
 * Hook for managing a single tag with details
 */
export function useTagDetails(tagId: string | null) {
  const [tag, setTag] = useState<TagWithDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TagError | null>(null);

  const refreshTag = useCallback(async () => {
    if (!tagId) return;
    
    setLoading(true);
    setError(null);
    
    const response = await fetchTagWithDetails(tagId);
    
    if (response.error) {
      setError(response.error);
    } else {
      setTag(response.data);
    }
    
    setLoading(false);
  }, [tagId]);

  useEffect(() => {
    if (tagId) {
      refreshTag();
    } else {
      setTag(null);
      setLoading(false);
      setError(null);
    }
  }, [tagId, refreshTag]);

  return {
    tag,
    loading,
    error,
    refreshTag
  };
}

/**
 * Hook for managing tag replies
 */
export function useTagReplies(tagId: string | null): UseTagRepliesHook {
  const [replies, setReplies] = useState<TagReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TagError | null>(null);

  const refreshReplies = useCallback(async () => {
    if (!tagId) return;
    
    setLoading(true);
    setError(null);
    
    const response = await fetchTagReplies(tagId);
    
    if (response.error) {
      setError(response.error);
    } else {
      setReplies(response.data);
    }
    
    setLoading(false);
  }, [tagId]);

  const handleCreateReply = useCallback(async (payload: CreateTagReplyPayload) => {
    const response = await createTagReply(payload);
    
    if (response.data && !response.error) {
      setReplies(prev => [...prev, response.data!]);
    }
    
    return response;
  }, []);

  useEffect(() => {
    if (tagId) {
      refreshReplies();
    } else {
      setReplies([]);
      setLoading(false);
      setError(null);
    }
  }, [tagId, refreshReplies]);

  return {
    replies,
    loading,
    error,
    createReply: handleCreateReply,
    refreshReplies
  };
}

/**
 * Hook for managing tag approvals
 */
export function useTagApprovals() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TagError | null>(null);

  const approveTag = useCallback(async (tagId: string, approverId: string) => {
    setLoading(true);
    setError(null);
    
    const response = await updateTagApproval(tagId, 'approved', approverId);
    
    if (response.error) {
      setError(response.error);
    }
    
    setLoading(false);
    return response;
  }, []);

  const rejectTag = useCallback(async (tagId: string, approverId: string) => {
    setLoading(true);
    setError(null);
    
    const response = await updateTagApproval(tagId, 'rejected', approverId);
    
    if (response.error) {
      setError(response.error);
    }
    
    setLoading(false);
    return response;
  }, []);

  return {
    approveTag,
    rejectTag,
    loading,
    error
  };
}

/**
 * Hook for managing unread notifications
 */
export function useUnreadNotifications(staffId: string | null) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TagError | null>(null);

  const refreshNotifications = useCallback(async () => {
    if (!staffId) return;
    
    setLoading(true);
    setError(null);
    
    const response = await fetchUnreadNotifications(staffId);
    
    if (response.error) {
      setError(response.error);
    } else {
      setNotifications(response.data);
    }
    
    setLoading(false);
  }, [staffId]);

  const markAsRead = useCallback(async (tagId: string) => {
    if (!staffId) return { error: { code: 'NO_STAFF_ID', message: 'Staff ID is required' } };
    
    const response = await markStaffNotificationAsRead(tagId, staffId);
    
    if (!response.error) {
      setNotifications(prev => prev.filter(notif => notif.tag_id !== tagId));
    }
    
    return response;
  }, [staffId]);

  useEffect(() => {
    if (staffId) {
      refreshNotifications();
    } else {
      setNotifications([]);
      setLoading(false);
      setError(null);
    }
  }, [staffId, refreshNotifications]);

  return {
    notifications,
    loading,
    error,
    refreshNotifications,
    markAsRead
  };
}

/**
 * Hook for file uploads with progress tracking
 */
export function useFileUpload() {
  const [uploads, setUploads] = useState<Map<string, FileUploadProgress>>(new Map());
  const [loading, setLoading] = useState(false);

  const uploadFile = useCallback(async (
    file: File,
    userId: string,
    tagId?: string
  ): Promise<{ url: string | null; error: TagError | null }> => {
    const uploadId = `${file.name}-${Date.now()}`;
    
    setUploads(prev => new Map(prev).set(uploadId, {
      filename: file.name,
      progress: 0,
      completed: false
    }));
    
    setLoading(true);
    
    try {
      // Simulate progress updates (in a real implementation, you might use upload progress events)
      const progressInterval = setInterval(() => {
        setUploads(prev => {
          const newMap = new Map(prev);
          const current = newMap.get(uploadId);
          if (current && current.progress < 90) {
            newMap.set(uploadId, {
              ...current,
              progress: Math.min(current.progress + 10, 90)
            });
          }
          return newMap;
        });
      }, 200);

      const response = await uploadTagAttachment(file, userId, tagId);
      
      clearInterval(progressInterval);
      
      setUploads(prev => {
        const newMap = new Map(prev);
        newMap.set(uploadId, {
          filename: file.name,
          progress: 100,
          completed: !response.error,
          error: response.error?.message
        });
        return newMap;
      });
      
      // Clean up upload tracking after a delay
      setTimeout(() => {
        setUploads(prev => {
          const newMap = new Map(prev);
          newMap.delete(uploadId);
          return newMap;
        });
      }, 3000);
      
      return response;
    } catch (error) {
      setUploads(prev => {
        const newMap = new Map(prev);
        newMap.set(uploadId, {
          filename: file.name,
          progress: 0,
          completed: false,
          error: 'Upload failed'
        });
        return newMap;
      });
      
      return {
        url: null,
        error: { code: 'UPLOAD_FAILED', message: 'Upload failed' }
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    uploadFile,
    uploads: Array.from(uploads.values()),
    loading
  };
}

/**
 * Hook for real-time notifications (using Supabase subscriptions)
 */
export function useRealtimeNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<TagData[]>([]);
  
  useEffect(() => {
    if (!userId) return;

    // Subscribe to new tags where user is tagged
    const tagsSubscription = supabase
      .channel('tags_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'tags',
        filter: `tagged_staff_ids.cs.{${userId}}`
      }, (payload) => {
        const newTag = payload.new as TagRow;
        setNotifications(prev => [transformTagRow(newTag), ...prev]);
      })
      .subscribe();

    // Subscribe to new replies on user's tags
    const repliesSubscription = supabase
      .channel('replies_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'tag_replies'
      }, async (payload) => {
        const newReply = payload.new as TagReplyRow;
        
        // Check if this reply is on a tag the user is involved with
        const { data: tag } = await fetchTag(newReply.tag_id);
        if (tag?.data && (
          tag.data.creatorId === userId || 
          tag.data.taggedStaffIds.includes(userId)
        )) {
          // Update notification or create new one
          setNotifications(prev => prev.map(notif => 
            notif.id === newReply.tag_id 
              ? { ...notif, updatedAt: new Date().toISOString() }
              : notif
          ));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tagsSubscription);
      supabase.removeChannel(repliesSubscription);
    };
  }, [userId]);

  return {
    notifications,
    clearNotifications: () => setNotifications([])
  };
}

// Helper function to transform tag row (used by realtime hook)
function transformTagRow(row: any): TagData {
  return {
    id: row.id,
    creatorId: row.creator_id,
    comment: row.comment || '',
    taggedStaffIds: row.tagged_staff_ids || [],
    attachments: row.attachments || [],
    coords: row.coords,
    timestamp: row.timestamp,
    drawingData: row.drawing_data || undefined,
    conversationId: row.conversation_id || undefined,
    replyToId: row.reply_to_id || undefined,
    requiresApproval: row.requires_approval,
    approvalStatus: row.approval_status,
    approvedBy: row.approved_by || undefined,
    approvedAt: row.approved_at || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}