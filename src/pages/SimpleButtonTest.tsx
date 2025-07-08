import React from 'react';
import { Button } from '@/components/ui/button';

const SimpleButtonTest = () => {
  React.useEffect(() => {
    console.log('🚀 SimpleButtonTest page loaded');
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Simple Button Test</h1>
      
      <div className="space-y-4">
        <Button 
          onClick={() => console.log('Simple button clicked')}
        >
          Simple Test Button
        </Button>
        
        <Button 
          onClick={() => console.log('Outline button clicked')}
          variant="outline"
        >
          Outline Button
        </Button>
        
        <Button 
          onClick={() => console.log('Custom ripple clicked')}
          rippleColor="rgba(255, 0, 0, 0.8)"
        >
          Red Ripple Button
        </Button>
        
        <Button 
          onClick={() => console.log('No ripple clicked')}
          enableRipple={false}
        >
          No Ripple Button
        </Button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold">Debug Info:</h3>
        <p>Open browser dev tools (F12) and click buttons to see console logs.</p>
        <p>You should see both button click logs AND ripple creation logs.</p>
      </div>
    </div>
  );
};

export default SimpleButtonTest; 