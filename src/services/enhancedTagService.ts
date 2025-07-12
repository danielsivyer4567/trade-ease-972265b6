// Enhanced Tag Service for Draggable Notifications System
// This service works with the new Supabase database schema

import { supabase } from '@/integrations/supabase/client';
import type {
  TagData,
  TagReply,
  TagWithDetails,
  CreateTagPayload,
  CreateTagReplyPayload,
  UpdateTagPayload,
  TagFilters,
  TagQueryOptions,
  TagResponse,
  TagListResponse,
  TagWithDetailsResponse,
  TagError,
  TagRow,
  TagReplyRow,
  StaffNotificationRow
} from '@/types/draggable-notifications';

// Helper function to transform database row to TagData
function transformTagRow(row: TagRow): TagData {
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

// Helper function to transform database row to TagReply
function transformTagReplyRow(row: TagReplyRow): TagReply {
  return {
    id: row.id,
    tagId: row.tag_id,
    userId: row.user_id,
    content: row.content,
    attachments: row.attachments || [],
    timestamp: row.timestamp,
    createdAt: row.created_at
  };
}

// Helper function to create error object
function createError(code: string, message: string, details?: any): TagError {
  return { code, message, details };
}

/**
 * Fetch a single tag by ID
 */
export async function fetchTag(tagId: string): Promise<TagResponse> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', tagId)
      .single();

    if (error) {
      return {
        data: null,
        error: createError('FETCH_ERROR', `Failed to fetch tag: ${error.message}`, error)
      };
    }

    return {
      data: transformTagRow(data),
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: createError('UNEXPECTED_ERROR', 'An unexpected error occurred', err)
    };
  }
}

/**
 * Fetch a tag with detailed information including creator and staff details
 */
export async function fetchTagWithDetails(tagId: string): Promise<TagWithDetailsResponse> {
  try {
    const { data, error } = await supabase
      .from('tags_with_details')
      .select('*')
      .eq('id', tagId)
      .single();

    if (error) {
      return {
        data: null,
        error: createError('FETCH_ERROR', `Failed to fetch tag details: ${error.message}`, error)
      };
    }

    return {
      data: data as TagWithDetails,
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: createError('UNEXPECTED_ERROR', 'An unexpected error occurred', err)
    };
  }
}

/**
 * Fetch multiple tags with optional filtering and pagination
 */
export async function fetchTags(
  filters: TagFilters = {},
  options: TagQueryOptions = {}
): Promise<TagListResponse> {
  try {
    let query = supabase.from('tags').select('*', { count: 'exact' });

    // Apply filters
    if (filters.creatorId) {
      query = query.eq('creator_id', filters.creatorId);
    }
    if (filters.taggedStaffId) {
      query = query.contains('tagged_staff_ids', [filters.taggedStaffId]);
    }
    if (filters.approvalStatus) {
      query = query.eq('approval_status', filters.approvalStatus);
    }
    if (filters.requiresApproval !== undefined) {
      query = query.eq('requires_approval', filters.requiresApproval);
    }
    if (filters.conversationId) {
      query = query.eq('conversation_id', filters.conversationId);
    }
    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }
    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    // Apply ordering
    const orderBy = options.orderBy || 'created_at';
    const orderDirection = options.orderDirection || 'desc';
    query = query.order(orderBy, { ascending: orderDirection === 'asc' });

    // Apply pagination
    if (options.offset) {
      query = query.range(options.offset, (options.offset + (options.limit || 50)) - 1);
    } else if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error, count } = await query;

    if (error) {
      return {
        data: [],
        count: 0,
        error: createError('FETCH_ERROR', `Failed to fetch tags: ${error.message}`, error)
      };
    }

    return {
      data: (data || []).map(transformTagRow),
      count: count || 0,
      error: null
    };
  } catch (err) {
    return {
      data: [],
      count: 0,
      error: createError('UNEXPECTED_ERROR', 'An unexpected error occurred', err)
    };
  }
}

/**
 * Create a new tag
 */
export async function createTag(payload: CreateTagPayload): Promise<TagResponse> {
  try {
    const insertData = {
      creator_id: payload.creatorId,
      comment: payload.comment,
      tagged_staff_ids: payload.taggedStaffIds,
      attachments: payload.attachments,
      coords: payload.coords,
      drawing_data: payload.drawingData,
      conversation_id: payload.conversationId,
      reply_to_id: payload.replyToId,
      requires_approval: payload.requiresApproval || false
    };

    const { data, error } = await supabase
      .from('tags')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: createError('CREATE_ERROR', `Failed to create tag: ${error.message}`, error)
      };
    }

    return {
      data: transformTagRow(data),
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: createError('UNEXPECTED_ERROR', 'An unexpected error occurred', err)
    };
  }
}

/**
 * Update an existing tag
 */
export async function updateTag(tagId: string, payload: UpdateTagPayload): Promise<TagResponse> {
  try {
    const updateData: Partial<TagRow> = {};
    
    if (payload.comment !== undefined) updateData.comment = payload.comment;
    if (payload.taggedStaffIds !== undefined) updateData.tagged_staff_ids = payload.taggedStaffIds;
    if (payload.attachments !== undefined) updateData.attachments = payload.attachments;
    if (payload.drawingData !== undefined) updateData.drawing_data = payload.drawingData;
    if (payload.requiresApproval !== undefined) updateData.requires_approval = payload.requiresApproval;

    const { data, error } = await supabase
      .from('tags')
      .update(updateData)
      .eq('id', tagId)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: createError('UPDATE_ERROR', `Failed to update tag: ${error.message}`, error)
      };
    }

    return {
      data: transformTagRow(data),
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: createError('UNEXPECTED_ERROR', 'An unexpected error occurred', err)
    };
  }
}

/**
 * Delete a tag
 */
export async function deleteTag(tagId: string): Promise<{ error: TagError | null }> {
  try {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', tagId);

    if (error) {
      return {
        error: createError('DELETE_ERROR', `Failed to delete tag: ${error.message}`, error)
      };
    }

    return { error: null };
  } catch (err) {
    return {
      error: createError('UNEXPECTED_ERROR', 'An unexpected error occurred', err)
    };
  }
}

/**
 * Approve or reject a tag
 */
export async function updateTagApproval(
  tagId: string,
  approvalStatus: 'approved' | 'rejected',
  approverId: string
): Promise<TagResponse> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .update({
        approval_status: approvalStatus,
        approved_by: approverId,
        approved_at: new Date().toISOString()
      })
      .eq('id', tagId)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: createError('APPROVAL_ERROR', `Failed to update tag approval: ${error.message}`, error)
      };
    }

    return {
      data: transformTagRow(data),
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: createError('UNEXPECTED_ERROR', 'An unexpected error occurred', err)
    };
  }
}

/**
 * Fetch replies for a tag
 */
export async function fetchTagReplies(tagId: string): Promise<{ data: TagReply[]; error: TagError | null }> {
  try {
    const { data, error } = await supabase
      .from('tag_replies')
      .select(`
        *,
        user:user_id (
          id,
          email
        ),
        user_profile:user_profiles!user_id (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('tag_id', tagId)
      .order('created_at', { ascending: true });

    if (error) {
      return {
        data: [],
        error: createError('FETCH_ERROR', `Failed to fetch tag replies: ${error.message}`, error)
      };
    }

    const replies = (data || []).map((row: any) => ({
      ...transformTagReplyRow(row),
      user: row.user && row.user_profile ? {
        id: row.user.id,
        email: row.user.email,
        name: `${row.user_profile.first_name || ''} ${row.user_profile.last_name || ''}`.trim(),
        avatar: row.user_profile.avatar_url,
        first_name: row.user_profile.first_name,
        last_name: row.user_profile.last_name
      } : undefined
    }));

    return {
      data: replies,
      error: null
    };
  } catch (err) {
    return {
      data: [],
      error: createError('UNEXPECTED_ERROR', 'An unexpected error occurred', err)
    };
  }
}

/**
 * Create a reply to a tag
 */
export async function createTagReply(payload: CreateTagReplyPayload): Promise<{ data: TagReply | null; error: TagError | null }> {
  try {
    const { data, error } = await supabase
      .from('tag_replies')
      .insert([{
        tag_id: payload.tagId,
        user_id: payload.userId,
        content: payload.content,
        attachments: payload.attachments || []
      }])
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: createError('CREATE_ERROR', `Failed to create tag reply: ${error.message}`, error)
      };
    }

    return {
      data: transformTagReplyRow(data),
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: createError('UNEXPECTED_ERROR', 'An unexpected error occurred', err)
    };
  }
}

/**
 * Mark staff notifications as read
 */
export async function markStaffNotificationAsRead(
  tagId: string,
  staffId: string
): Promise<{ error: TagError | null }> {
  try {
    const { error } = await supabase
      .from('staff_notifications')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('tag_id', tagId)
      .eq('staff_id', staffId);

    if (error) {
      return {
        error: createError('UPDATE_ERROR', `Failed to mark notification as read: ${error.message}`, error)
      };
    }

    return { error: null };
  } catch (err) {
    return {
      error: createError('UNEXPECTED_ERROR', 'An unexpected error occurred', err)
    };
  }
}

/**
 * Get unread notifications for a staff member
 */
export async function fetchUnreadNotifications(
  staffId: string
): Promise<{ data: StaffNotificationRow[]; error: TagError | null }> {
  try {
    const { data, error } = await supabase
      .from('staff_notifications')
      .select(`
        *,
        tag:tags (
          id,
          comment,
          coords,
          created_at,
          creator:creator_id (
            id,
            email
          ),
          creator_profile:user_profiles!creator_id (
            first_name,
            last_name,
            avatar_url
          )
        )
      `)
      .eq('staff_id', staffId)
      .eq('read', false)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        data: [],
        error: createError('FETCH_ERROR', `Failed to fetch unread notifications: ${error.message}`, error)
      };
    }

    return {
      data: data || [],
      error: null
    };
  } catch (err) {
    return {
      data: [],
      error: createError('UNEXPECTED_ERROR', 'An unexpected error occurred', err)
    };
  }
}

/**
 * Upload file to Supabase storage
 */
export async function uploadTagAttachment(
  file: File,
  userId: string,
  tagId?: string
): Promise<{ url: string | null; error: TagError | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${tagId || 'temp'}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('tag-attachments')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return {
        url: null,
        error: createError('UPLOAD_ERROR', `Failed to upload file: ${error.message}`, error)
      };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('tag-attachments')
      .getPublicUrl(fileName);

    return {
      url: publicUrl,
      error: null
    };
  } catch (err) {
    return {
      url: null,
      error: createError('UNEXPECTED_ERROR', 'An unexpected error occurred during upload', err)
    };
  }
}

// Backward compatibility exports (for existing code)
export { fetchTag as fetchTagData };
export { createTagReply as addTagReply };
export { fetchTagReplies as getTagReplies };

// Type exports for convenience
export type {
  TagData,
  TagReply,
  TagWithDetails,
  CreateTagPayload,
  CreateTagReplyPayload,
  UpdateTagPayload,
  TagFilters,
  TagQueryOptions
} from '@/types/draggable-notifications';