/**
 * This utility disables the React DevTools overlay that can cause message channel errors
 * during development.
 */

// Extend the Window interface to include the React DevTools hook
declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
      isDisabled?: boolean;
      [key: string]: any;
    };
  }
}

export function disableDevToolsOverlay() {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Ensure the hook exists before trying to modify it
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.isDisabled = true;
    } else {
      // If the hook doesn't exist, you might initialize it,
      // though this is less common for just disabling.
      // For now, we'll just ensure isDisabled is set if the hook is created later.
      // A more robust approach for initializing might be needed if this is a goal.
      // However, the error occurs when *setting* the property, suggesting the hook exists.
      // The primary fix is to avoid reassigning the whole object.
      // Let's try this simpler modification first:
      try {
        Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
          configurable: true,
          value: {
            ...(window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {}),
            isDisabled: true,
          }
        });
      } catch (e) {
        // If defineProperty fails (e.g. already non-configurable with a getter),
        // and the hook object exists, try to set isDisabled directly.
        // This path is less likely if the error is "only a getter" on the initial assignment attempt.
        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__.isDisabled = true;
        }
        console.warn('Could not define __REACT_DEVTOOLS_GLOBAL_HOOK__ property, or set isDisabled.', e);
      }
    }
    
    // Disable the error overlay
    window.addEventListener('error', (event) => {
      if (event.message && event.message.includes('message channel closed')) {
        event.stopPropagation();
        event.preventDefault();
      }
    }, true);
  }
} 