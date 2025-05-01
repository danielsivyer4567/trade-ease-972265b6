import { TRPCError } from '@trpc/server';
import { z } from 'zod';

// Validation schemas
export const workflowPermissionSchema = z.object({
  operation: z.enum(['create', 'edit', 'view', 'delete', 'search']),
  context: z.enum(['personal-workflow', 'task-workflow', 'project-workflow']),
  userId: z.string().uuid(),
  timestamp: z.number().int().positive(),
});

export const workflowContentSchema = z.object({
  content: z.string()
    .min(1)
    .max(500)
    .refine(content => !containsSensitivePatterns(content), {
      message: "Content contains forbidden patterns"
    }),
  nodeType: z.enum(['task', 'condition', 'action', 'timer', 'notification']),
  metadata: z.record(z.unknown()).optional(),
});

export const sessionValidationSchema = z.object({
  sessionId: z.string().uuid(),
  csrfToken: z.string(),
  deviceInfo: z.object({
    id: z.string(),
    userAgent: z.string(),
    screenResolution: z.string(),
    timezone: z.string(),
    language: z.string(),
    platform: z.string(),
  }),
});

// Security constants
const SECURITY_CONSTANTS = {
  MAX_WORKFLOW_DEPTH: 3,
  MAX_NODES_PER_WORKFLOW: 50,
  REQUEST_TIMEOUT_MS: 10000,
  MAX_BATCH_SIZE: 10,
};

// Forbidden patterns for server-side validation
const FORBIDDEN_PATTERNS = {
  SYSTEM_COMMANDS: [
    'sudo', 'exec', 'eval', 'system', 'shell', 'process',
    'require', 'import', 'export', 'module'
  ],
  DATABASE_OPERATIONS: [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 
    'CREATE', 'MODIFY', 'SCHEMA', 'DATABASE'
  ],
  FILE_OPERATIONS: [
    'readFile', 'writeFile', 'unlink', 'fs', 'path',
    'file:', 'data:', 'https:', 'ftp:', '.env'
  ],
  NETWORK_OPERATIONS: [
    'fetch', 'http', 'xhr', 'websocket', 'socket',
    'request', 'response', 'network'
  ],
  SENSITIVE_PATTERNS: [
    'password', 'token', 'secret', 'key', 'auth',
    'admin', 'root', 'superuser', 'config'
  ]
};

// Validation utilities
function containsSensitivePatterns(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return Object.values(FORBIDDEN_PATTERNS).some(patterns =>
    patterns.some(pattern => lowerContent.includes(pattern.toLowerCase()))
  );
}

export class WorkflowValidator {
  static async validateWorkflowOperation(
    permissions: z.infer<typeof workflowPermissionSchema>,
    content: z.infer<typeof workflowContentSchema>,
    session: z.infer<typeof sessionValidationSchema>
  ) {
    try {
      // Validate basic schemas
      await workflowPermissionSchema.parseAsync(permissions);
      await workflowContentSchema.parseAsync(content);
      await sessionValidationSchema.parseAsync(session);

      // Validate operation timing
      const operationAge = Date.now() - permissions.timestamp;
      if (operationAge > SECURITY_CONSTANTS.REQUEST_TIMEOUT_MS) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Operation timeout - request too old',
        });
      }

      // Validate workflow depth and complexity
      if (this.calculateWorkflowDepth(content) > SECURITY_CONSTANTS.MAX_WORKFLOW_DEPTH) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Workflow exceeds maximum allowed depth',
        });
      }

      return true;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || 'Invalid workflow operation',
      });
    }
  }

  private static calculateWorkflowDepth(content: z.infer<typeof workflowContentSchema>): number {
    // Implement workflow depth calculation logic
    // This is a placeholder - implement actual depth calculation based on your workflow structure
    return 1;
  }

  static async validateBatchOperation(
    operations: Array<{
      permissions: z.infer<typeof workflowPermissionSchema>,
      content: z.infer<typeof workflowContentSchema>
    }>,
    session: z.infer<typeof sessionValidationSchema>
  ) {
    // Validate batch size
    if (operations.length > SECURITY_CONSTANTS.MAX_BATCH_SIZE) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Batch size exceeds maximum of ${SECURITY_CONSTANTS.MAX_BATCH_SIZE} operations`,
      });
    }

    // Validate each operation in the batch
    await Promise.all(
      operations.map(op => this.validateWorkflowOperation(op.permissions, op.content, session))
    );

    return true;
  }
}

// Export types for use in other files
export type WorkflowPermissions = z.infer<typeof workflowPermissionSchema>;
export type WorkflowContent = z.infer<typeof workflowContentSchema>;
export type SessionValidation = z.infer<typeof sessionValidationSchema>; 