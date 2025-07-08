import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Download, Settings, Trash2, Share, Plus } from 'lucide-react';

const ButtonRippleDemo = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Button Ripple Effects Demo</h1>
        <p className="text-muted-foreground">
          All buttons now feature elegant <span className="font-semibold text-slate-400">light silver</span> ripple animations!
        </p>
      </div>

      {/* Button Variants */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Button Variants - Light Silver Ripples</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button variant="default">
            Default Button
          </Button>
          
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Destructive
          </Button>
          
          <Button variant="outline">
            Outline Button
          </Button>
          
          <Button variant="secondary">
            Secondary Button
          </Button>
          
          <Button variant="ghost">
            Ghost Button
          </Button>
          
          <Button variant="link">
            Link Button
          </Button>
        </div>
      </Card>

      {/* Button Sizes */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Button Sizes - Consistent Ripples</h2>
        <div className="flex flex-wrap items-end gap-4">
          <Button size="sm">
            Small
          </Button>
          
          <Button size="default">
            Default
          </Button>
          
          <Button size="lg">
            Large
          </Button>
          
          <Button size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Customization Examples */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Customization Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button rippleColor="rgba(255, 215, 0, 0.4)">
            <Heart className="h-4 w-4 mr-2" />
            Gold Ripple
          </Button>
          
          <Button rippleColor="rgba(34, 197, 94, 0.4)">
            <Download className="h-4 w-4 mr-2" />
            Green Ripple
          </Button>
          
          <Button rippleColor="rgba(239, 68, 68, 0.4)">
            <Share className="h-4 w-4 mr-2" />
            Red Ripple
          </Button>
          
          <Button rippleDuration={1000}>
            Slow Ripple (1s)
          </Button>
          
          <Button rippleDuration={300}>
            Fast Ripple (0.3s)
          </Button>
          
          <Button enableRipple={false}>
            No Ripple
          </Button>
        </div>
      </Card>

      {/* Real-world Examples */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Real-world Usage</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button>Save Changes</Button>
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      </Card>

      {/* Light Silver Theme Info */}
      <Card className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
        <h2 className="text-xl font-semibold mb-2 text-slate-700">✨ Light Silver Theme</h2>
        <p className="text-slate-600 mb-4">
          All buttons and toggles across your Trade Ease application now feature elegant light silver ripple effects 
          with <code className="bg-slate-200 px-2 py-1 rounded text-xs">rgba(192, 192, 192, 0.4)</code> for a 
          consistent, professional appearance.
        </p>
        <div className="flex gap-2">
          <Button size="sm">Try clicking any button!</Button>
          <Button variant="outline" size="sm">See the light silver ripples</Button>
        </div>
      </Card>
    </div>
  );
};

export default ButtonRippleDemo; 