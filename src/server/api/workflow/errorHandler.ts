import { TRPCError } from '@trpc/server';
import { WorkflowMonitor } from './monitoring';

// Custom error types
export enum WorkflowErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  SECURITY_ERROR = 'SECURITY_ERROR',
  WORKFLOW_ERROR = 'WORKFLOW_ERROR',
  SYSTEM_ERROR = 'SYSTEM_ERROR'
}

interface ErrorMetadata {
  userId?: string;
  operation?: string;
  workflowId?: string;
  deviceInfo?: any;
  timestamp: number;
}

export class WorkflowError extends Error {
  public readonly type: WorkflowErrorType;
  public readonly metadata: ErrorMetadata;
  public readonly statusCode: number;

  constructor(
    type: WorkflowErrorType,
    message: string,
    metadata: Partial<ErrorMetadata>,
    statusCode: number = 400
  ) {
    super(message);
    this.type = type;
    this.metadata = {
      ...metadata,
      timestamp: Date.now()
    };
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  toTRPCError(): TRPCError {
    return new TRPCError({
      code: this.getTRPCErrorCode(),
      message: this.message,
      cause: this
    });
  }

  private getTRPCErrorCode(): any {
    switch (this.type) {
      case WorkflowErrorType.VALIDATION_ERROR:
        return 'BAD_REQUEST';
      case WorkflowErrorType.PERMISSION_ERROR:
        return 'UNAUTHORIZED';
      case WorkflowErrorType.RATE_LIMIT_ERROR:
        return 'TOO_MANY_REQUESTS';
      case WorkflowErrorType.SECURITY_ERROR:
        return 'FORBIDDEN';
      case WorkflowErrorType.WORKFLOW_ERROR:
        return 'BAD_REQUEST';
      case WorkflowErrorType.SYSTEM_ERROR:
        return 'INTERNAL_SERVER_ERROR';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}

export class WorkflowErrorHandler {
  private static monitor = WorkflowMonitor.getInstance();

  static handleError(error: any, userId?: string, operation?: string): never {
    if (error instanceof WorkflowError) {
      // Log the error with monitoring
      this.monitor.logOperation(
        operation || 'unknown',
        userId || 'unknown',
        error.metadata as any,
        error.metadata as any,
        error.metadata as any,
        'failure',
        error
      );
      throw error.toTRPCError();
    }

    if (error instanceof TRPCError) {
      throw error;
    }

    // Handle unknown errors
    console.error('Unexpected error:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  }

  static throwValidationError(message: string, metadata: Partial<ErrorMetadata>): never {
    throw new WorkflowError(
      WorkflowErrorType.VALIDATION_ERROR,
      message,
      metadata
    );
  }

  static throwPermissionError(message: string, metadata: Partial<ErrorMetadata>): never {
    throw new WorkflowError(
      WorkflowErrorType.PERMISSION_ERROR,
      message,
      metadata,
      403
    );
  }

  static throwRateLimitError(message: string, metadata: Partial<ErrorMetadata>): never {
    throw new WorkflowError(
      WorkflowErrorType.RATE_LIMIT_ERROR,
      message,
      metadata,
      429
    );
  }

  static throwSecurityError(message: string, metadata: Partial<ErrorMetadata>): never {
    throw new WorkflowError(
      WorkflowErrorType.SECURITY_ERROR,
      message,
      metadata,
      403
    );
  }

  static throwWorkflowError(message: string, metadata: Partial<ErrorMetadata>): never {
    throw new WorkflowError(
      WorkflowErrorType.WORKFLOW_ERROR,
      message,
      metadata
    );
  }

  static throwSystemError(message: string, metadata: Partial<ErrorMetadata>): never {
    throw new WorkflowError(
      WorkflowErrorType.SYSTEM_ERROR,
      message,
      metadata,
      500
    );
  }
} 