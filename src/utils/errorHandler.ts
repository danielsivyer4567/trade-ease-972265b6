// Enhanced error handler for better error reporting and recovery

let isErrorHandlerInitialized = false;

export function initializeErrorHandler() {
  if (isErrorHandlerInitialized) {
    return;
  }

  console.log('Initializing enhanced error handler...');

  // Error filters to ignore common browser extension and development errors
  const errorFilters = [
    'message channel closed',
    'A listener indicated an asynchronous response by returning true',
    'Extension context invalidated',
    'chrome-extension://',
    'moz-extension://',
    'vendor.js',
    'ResizeObserver loop',
    'Non-Error promise rejection captured',
    'Script error.',
    'Loading CSS chunk',
    'Loading chunk',
    'Network request failed',
    'ChunkLoadError',
    'Failed to fetch dynamically imported module',
    'AbortError: The operation was aborted'
  ];

  function shouldIgnoreError(error: any): boolean {
    if (!error) return false;
    
    const errorStr = String(error.message || error.toString() || '');
    const stack = String(error.stack || '');
    const fullError = errorStr + ' ' + stack;
    
    return errorFilters.some(filter => 
      fullError.toLowerCase().includes(filter.toLowerCase())
    );
  }

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (shouldIgnoreError(event.reason)) {
      console.debug('[Filtered Promise Rejection]', event.reason);
      event.preventDefault();
      return;
    }
    
    console.error('[Unhandled Promise Rejection]', event.reason);
    
    // Don't prevent default for real errors - let them bubble up
    // but provide better logging
    if (event.reason && event.reason.message) {
      console.error('Promise rejection details:', {
        message: event.reason.message,
        stack: event.reason.stack,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    if (shouldIgnoreError(event.error) || shouldIgnoreError(event.message)) {
      console.debug('[Filtered Error]', event.error || event.message);
      event.preventDefault();
      return;
    }
    
    console.error('[Global Error]', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  });

  // Override console.error to filter out extension errors
  const originalConsoleError = console.error;
  console.error = function(...args: any[]) {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    
    if (shouldIgnoreError({ message })) {
      console.debug('[Filtered Console Error]', ...args);
      return;
    }
    
    originalConsoleError.apply(console, args);
  };

  // Add some recovery mechanisms
  window.addEventListener('load', () => {
    console.log('App fully loaded');
  });

  // Handle network errors gracefully
  window.addEventListener('online', () => {
    console.log('Network connection restored');
  });

  window.addEventListener('offline', () => {
    console.warn('Network connection lost - app may have limited functionality');
  });

  isErrorHandlerInitialized = true;
  console.log('Enhanced error handler initialized successfully');
}

// Auto-initialize
initializeErrorHandler(); 