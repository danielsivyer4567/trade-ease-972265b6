// Performance monitoring utility for React apps

// Track render counts for components to detect potential infinite loops
const renderCounts = new Map<string, number>();

// Track history API calls
const historyApiCalls = {
  count: 0,
  lastResetTime: Date.now(),
  maxAllowedPerInterval: 90, // Slightly below browser limits (100/10sec)
  intervalMs: 10000, // 10 seconds
};

// Reset history API call count after the interval
setInterval(() => {
  historyApiCalls.count = 0;
  historyApiCalls.lastResetTime = Date.now();
}, historyApiCalls.intervalMs);

export const trackRender = (componentName: string): void => {
  if (import.meta.env.MODE !== 'production') {
    const currentCount = renderCounts.get(componentName) || 0;
    renderCounts.set(componentName, currentCount + 1);
    
    // Warn if component is rendering excessively
    if (currentCount + 1 > 50) {
      console.warn(`⚠️ Potential render loop: ${componentName} has rendered ${currentCount + 1} times`);
    }
  }
};

export const trackHistoryCall = (): boolean => {
  if (import.meta.env.MODE !== 'production') {
    historyApiCalls.count += 1;
    
    // Check if we're approaching the browser limit
    if (historyApiCalls.count > historyApiCalls.maxAllowedPerInterval) {
      console.error(`⚠️ Too many history API calls: ${historyApiCalls.count} in the last ${(Date.now() - historyApiCalls.lastResetTime) / 1000}s`);
      return false; // Suggest skipping this history call
    }
  }
  return true; // Safe to proceed with history call
};

export const resetRenderCount = (componentName: string): void => {
  renderCounts.delete(componentName);
};

// Hook for tracking component renders
export const useTrackRender = (componentName: string): void => {
  if (import.meta.env.MODE !== 'production') {
    trackRender(componentName);
  }
};
