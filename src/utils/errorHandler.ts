// Global error handler for async message channel errors and browser extension issues
export class AsyncErrorHandler {
  private static errorFilters = [
    'message channel closed',
    'A listener indicated an asynchronous response by returning true',
    'Extension context invalidated',
    'chrome-extension://',
    'moz-extension://'
  ];

  private static shouldIgnoreError(error: any): boolean {
    const errorMessage = error?.message || error?.toString() || '';
    return this.errorFilters.some(filter => 
      errorMessage.toLowerCase().includes(filter.toLowerCase())
    );
  }

  public static init() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (this.shouldIgnoreError(event.reason)) {
        console.debug('Filtered async error (likely browser extension):', event.reason);
        event.preventDefault();
        return;
      }
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      if (this.shouldIgnoreError(event.error)) {
        console.debug('Filtered error (likely browser extension):', event.error);
        event.preventDefault();
        return;
      }
    });
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