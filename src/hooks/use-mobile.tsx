
import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 768): boolean {
  // Initialize with null and handle during useEffect to avoid SSR issues
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Safe to access window inside useEffect
    const checkSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Call once to set initial value
    checkSize();
    
    // Add event listener to update on resize
    window.addEventListener('resize', checkSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkSize);
  }, [breakpoint]);

  return isMobile;
}
