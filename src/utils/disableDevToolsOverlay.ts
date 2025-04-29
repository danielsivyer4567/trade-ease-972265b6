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
    // Disable the React DevTools overlay
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      ...window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
      isDisabled: true
    };
    
    // Disable the error overlay
    window.addEventListener('error', (event) => {
      if (event.message.includes('message channel closed')) {
        event.stopPropagation();
        event.preventDefault();
      }
    }, true);
  }
} 