
import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < breakpoint);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Add event listener to update on resize
    window.addEventListener('resize', checkSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkSize);
  }, [breakpoint]);

  return isMobile;
}
