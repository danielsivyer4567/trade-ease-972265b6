// Early error handler - this should be inlined in index.html for earliest possible initialization
export const earlyErrorHandlerScript = `
<script>
(function() {
  // List of error patterns to filter
  const errorFilters = [
    'message channel closed',
    'A listener indicated an asynchronous response by returning true',
    'Extension context invalidated',
    'chrome-extension://',
    'moz-extension://',
    'vendor.js',
    'ResizeObserver loop'
  ];

  function shouldIgnoreError(error) {
    const errorStr = (error && (error.message || error.toString())) || '';
    const stack = (error && error.stack) || '';
    const fullError = errorStr + ' ' + stack;
    
    return errorFilters.some(filter => 
      fullError.toLowerCase().includes(filter.toLowerCase())
    );
  }

  // Override console.error immediately
  const originalConsoleError = console.error;
  console.error = function() {
    const args = Array.prototype.slice.call(arguments);
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    
    if (shouldIgnoreError(message)) {
      console.debug('[Early Filter]', ...args);
      return;
    }
    originalConsoleError.apply(console, args);
  };

  // Handle errors
  window.addEventListener('error', function(event) {
    if (shouldIgnoreError(event.error) || shouldIgnoreError(event.message)) {
      console.debug('[Early Filter - Error]', event.error || event.message);
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);

  // Handle unhandled rejections
  window.addEventListener('unhandledrejection', function(event) {
    if (shouldIgnoreError(event.reason)) {
      console.debug('[Early Filter - Rejection]', event.reason);
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);

  console.debug('[Early Error Handler] Initialized');
})();
</script>
`; 