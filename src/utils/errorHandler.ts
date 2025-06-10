// Global error handler for async message channel errors and browser extension issues
export class AsyncErrorHandler {
  private static errorFilters = [
    'message channel closed',
    'A listener indicated an asynchronous response by returning true',
    'Extension context invalidated',
    'chrome-extension://',
    'moz-extension://',
    'vendor.js', // Filter vendor.js errors
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    'Non-Error promise rejection captured'
  ];

  private static shouldIgnoreError(error: any): boolean {
    const errorMessage = error?.message || error?.toString() || '';
    const errorStack = error?.stack || '';
    
    // Check both message and stack trace
    const fullError = errorMessage + ' ' + errorStack;
    
    return this.errorFilters.some(filter => 
      fullError.toLowerCase().includes(filter.toLowerCase())
    );
  }

  public static init() {
    // Immediately override console.error to catch early errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      if (this.shouldIgnoreError(message)) {
        console.debug('[Filtered Error]', ...args);
        return;
      }
      originalConsoleError.apply(console, args);
    };

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (this.shouldIgnoreError(event.reason)) {
        console.debug('[Filtered Promise Rejection]', event.reason);
        event.preventDefault();
        return;
      }
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      if (this.shouldIgnoreError(event.error) || this.shouldIgnoreError(event.message)) {
        console.debug('[Filtered Global Error]', event.error || event.message);
        event.preventDefault();
        return;
      }
    });

    // Intercept Promise constructor to catch async errors at source
    const OriginalPromise = window.Promise;
    window.Promise = class FilteredPromise<T> extends OriginalPromise<T> {
      constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
        super((resolve, reject) => {
          executor(resolve, (reason) => {
            if (AsyncErrorHandler.shouldIgnoreError(reason)) {
              console.debug('[Filtered Promise Constructor Rejection]', reason);
              resolve(undefined as any); // Resolve instead of reject for filtered errors
            } else {
              reject(reason);
            }
          });
        });
      }
    } as any;
  }

  public static wrapAsyncOperation<T>(
    operation: () => Promise<T>,
    fallback?: T
  ): Promise<T> {
    return operation().catch((error) => {
      if (this.shouldIgnoreError(error)) {
        console.debug('Filtered async operation error:', error);
        if (fallback !== undefined) {
          return fallback;
        }
      }
      throw error;
    });
  }
}

// Initialize error handling
AsyncErrorHandler.init(); 