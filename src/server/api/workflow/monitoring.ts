import { Logger } from 'winston';
import winston from 'winston';
import { WorkflowContent, WorkflowPermissions, SessionValidation } from './validation';

// Configure Winston logger
const logger: Logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Monitoring metrics
interface SecurityMetrics {
  failedAttempts: Map<string, number>;
  suspiciousActivities: Map<string, number>;
  rateLimit: Map<string, number[]>;
  activeUsers: Set<string>;
  lastCleanup: number;
}

export class WorkflowMonitor {
  private static instance: WorkflowMonitor;
  private metrics: SecurityMetrics = {
    failedAttempts: new Map(),
    suspiciousActivities: new Map(),
    rateLimit: new Map(),
    activeUsers: new Set(),
    lastCleanup: Date.now()
  };

  private constructor() {
    // Run cleanup every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  static getInstance(): WorkflowMonitor {
    if (!WorkflowMonitor.instance) {
      WorkflowMonitor.instance = new WorkflowMonitor();
    }
    return WorkflowMonitor.instance;
  }

  // Log workflow operation
  logOperation(
    operation: string,
    userId: string,
    content: WorkflowContent,
    permissions: WorkflowPermissions,
    session: SessionValidation,
    status: 'success' | 'failure' | 'blocked',
    error?: Error
  ) {
    const logData = {
      timestamp: new Date().toISOString(),
      operation,
      userId,
      nodeType: content.nodeType,
      deviceInfo: session.deviceInfo,
      status,
      error: error?.message,
      stack: error?.stack,
      metadata: {
        contentLength: content.content.length,
        hasMetadata: !!content.metadata,
        permissions: permissions.operation,
        context: permissions.context
      }
    };

    if (status === 'success') {
      logger.info('Workflow operation completed', logData);
    } else if (status === 'failure') {
      logger.error('Workflow operation failed', logData);
      this.recordFailedAttempt(userId);
    } else {
      logger.warn('Workflow operation blocked', logData);
      this.recordSuspiciousActivity(userId);
    }

    // Update metrics
    this.updateMetrics(userId, status);
  }

  // Record failed attempt
  private recordFailedAttempt(userId: string) {
    const current = this.metrics.failedAttempts.get(userId) || 0;
    this.metrics.failedAttempts.set(userId, current + 1);
  }

  // Record suspicious activity
  private recordSuspiciousActivity(userId: string) {
    const current = this.metrics.suspiciousActivities.get(userId) || 0;
    this.metrics.suspiciousActivities.set(userId, current + 1);
  }

  // Update metrics
  private updateMetrics(userId: string, status: string) {
    // Update rate limiting
    const now = Date.now();
    const userRequests = this.metrics.rateLimit.get(userId) || [];
    userRequests.push(now);
    this.metrics.rateLimit.set(userId, userRequests);

    // Update active users
    this.metrics.activeUsers.add(userId);
  }

  // Check if user is within rate limit
  isWithinRateLimit(userId: string): boolean {
    const now = Date.now();
    const userRequests = this.metrics.rateLimit.get(userId) || [];
    const recentRequests = userRequests.filter(time => now - time < 60000); // Last minute
    this.metrics.rateLimit.set(userId, recentRequests);
    return recentRequests.length <= 60; // 60 requests per minute
  }

  // Get user metrics
  getUserMetrics(userId: string) {
    return {
      failedAttempts: this.metrics.failedAttempts.get(userId) || 0,
      suspiciousActivities: this.metrics.suspiciousActivities.get(userId) || 0,
      requestsLastMinute: (this.metrics.rateLimit.get(userId) || []).length
    };
  }

  // Cleanup old data
  private cleanup() {
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    // Clean up rate limit data older than 1 hour
    for (const [userId, timestamps] of this.metrics.rateLimit.entries()) {
      const recent = timestamps.filter(time => now - time < ONE_HOUR);
      if (recent.length === 0) {
        this.metrics.rateLimit.delete(userId);
      } else {
        this.metrics.rateLimit.set(userId, recent);
      }
    }

    // Reset metrics periodically
    if (now - this.metrics.lastCleanup > ONE_HOUR) {
      this.metrics.failedAttempts.clear();
      this.metrics.suspiciousActivities.clear();
      this.metrics.activeUsers.clear();
      this.metrics.lastCleanup = now;
    }
  }

  // Alert on suspicious activity
  private async alertOnSuspiciousActivity(userId: string, activity: any) {
    // Implement your alerting system here (e.g., email, Slack, etc.)
    logger.warn('Suspicious activity detected', {
      userId,
      activity,
      timestamp: new Date().toISOString()
    });
  }
} 