import { supabase } from '@/integrations/supabase/client';

// No need to create a new client, use the existing one
// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  metadata?: any;
  timestamp: string;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = import.meta.env.MODE === 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private async logToSupabase(entry: LogEntry) {
    try {
      const { error } = await supabase
        .from('logs')
        .insert({
          level: entry.level,
          message: entry.message,
          metadata: entry.metadata,
          timestamp: entry.timestamp
        });

      if (error) {
        console.error('Failed to log to Supabase:', error);
      }
    } catch (error) {
      console.error('Failed to log to Supabase:', error);
    }
  }

  private formatMessage(level: LogLevel, message: string, metadata?: any): LogEntry {
    return {
      level,
      message,
      metadata,
      timestamp: new Date().toISOString()
    };
  }

  private async log(level: LogLevel, message: string, metadata?: any) {
    const entry = this.formatMessage(level, message, metadata);

    // Always log to console in development
    if (this.isDevelopment) {
      console[level](message, metadata || '');
    }

    // Log to Supabase in production
    if (import.meta.env.MODE === 'production') {
      await this.logToSupabase(entry);
    }
  }

  public info(message: string, metadata?: any) {
    this.log('info', message, metadata);
  }

  public warn(message: string, metadata?: any) {
    this.log('warn', message, metadata);
  }

  public error(message: string, metadata?: any) {
    this.log('error', message, metadata);
  }

  public debug(message: string, metadata?: any) {
    if (this.isDevelopment) {
      this.log('debug', message, metadata);
    }
  }
}

export const logger = Logger.getInstance();