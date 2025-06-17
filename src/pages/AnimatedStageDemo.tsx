import { useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatedStageProgress } from '@/components/dashboard/AnimatedStageProgress';
import { CustomerStageIndicator } from '@/components/dashboard/CustomerStageIndicator';
import { CustomerProgressBar } from '@/components/dashboard/CustomerProgressBar';
import { toast } from 'sonner';

export default function AnimatedStageDemo() {
  const [layout, setLayout] = useState<'horizontal' | 'vertical' | 'cards'>('horizontal');
  const [colorScheme, setColorScheme] = useState<'blue' | 'green' | 'purple' | 'gradient'>('blue');
  const [animationSpeed, setAnimationSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showConnectors, setShowConnectors] = useState(true);

  // Demo stages data
  const [stages, setStages] = useState([
    {
      id: '1',
      title: 'Lead Captured',
      description: 'Initial contact established',
      completed: true,
      active: false,
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Site Audit',
      description: 'Property assessment completed',
      completed: true,
      active: false,
      date: '2024-01-17'
    },
    {
      id: '3',
      title: 'Quote Sent',
      description: 'Proposal delivered to customer',
      completed: true,
      active: false,
      date: '2024-01-18'
    },
    {
      id: '4',
      title: 'Job Started',
      description: 'Work in progress',
      completed: false,
      active: true,
      date: null
    },
    {
      id: '5',
      title: 'Invoice Sent',
      description: 'Awaiting payment',
      completed: false,
      active: false,
      date: null
    }
  ]);

  const handleStageClick = (stageId: string) => {
    toast.info(`Stage ${stageId} clicked`);
    
    // Demo: Toggle stage completion
    setStages(prev => prev.map(stage => {
      if (stage.id === stageId) {
        return { ...stage, completed: !stage.completed };
      }
      return stage;
    }));
  };

  const resetStages = () => {
    setStages(prev => prev.map((stage, index) => ({
      ...stage,
      completed: index < 3,
      active: index === 3
    })));
  };

  const completeAllStages = () => {
    setStages(prev => prev.map(stage => ({
      ...stage,
      completed: true,
      active: false
    })));
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Animated Stage Progress Demo</h1>
        {/* Controls */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Animation Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Layout</label>
              <Select value={layout} onValueChange={(value: any) => setLayout(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="cards">Cards</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Color Scheme</label>
              <Select value={colorScheme} onValueChange={(value: any) => setColorScheme(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Animation Speed</label>
              <Select value={animationSpeed} onValueChange={(value: any) => setAnimationSpeed(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Size</label>
              <Select value={size} onValueChange={(value: any) => setSize(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Actions</label>
              <div className="flex gap-2">
                <Button onClick={resetStages} variant="outline" size="sm">
                  Reset
                </Button>
                <Button onClick={completeAllStages} variant="outline" size="sm">
                  Complete All
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showConnectors}
                onChange={(e) => setShowConnectors(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Connectors</span>
            </label>
          </div>
        </Card>

        {/* New Animated Stage Progress Component */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">New Animated Stage Progress</h2>
          <div className={layout === 'vertical' ? 'max-w-md' : ''}>
            <AnimatedStageProgress
              stages={stages}
              layout={layout}
              colorScheme={colorScheme}
              animationSpeed={animationSpeed}
              size={size}
              showConnectors={showConnectors}
              onStageClick={handleStageClick}
            />
          </div>
        </Card>

        {/* Original Components with Animations */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Enhanced Original Components</h2>
          
          <div className="space-y-8">
            {/* Customer Stage Indicator */}
            <div>
              <h3 className="text-lg font-medium mb-4">Customer Stage Indicator (with animations)</h3>
              <div className="flex gap-4 items-center">
                <CustomerStageIndicator customerId="demo-1" size="sm" />
                <CustomerStageIndicator customerId="demo-1" size="md" />
                <CustomerStageIndicator customerId="demo-1" size="lg" />
              </div>
            </div>

            {/* Customer Progress Bar */}
            <div>
              <h3 className="text-lg font-medium mb-4">Customer Progress Bar (with animations)</h3>
              <div className="max-w-2xl">
                <CustomerProgressBar customerId="demo-1" />
              </div>
            </div>
          </div>
        </Card>

        {/* Animation Features */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Animation Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Stage Transitions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Spring animations for smooth transitions</li>
                <li>• Staggered animations for sequential reveal</li>
                <li>• Scale and rotation effects on completion</li>
                <li>• Hover and tap interactions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Visual Effects</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Glow effect for active stages</li>
                <li>• Sparkle animations on completed stages</li>
                <li>• Progress bar shimmer effect</li>
                <li>• Animated tooltips on hover</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Customization Options</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Multiple layout options</li>
                <li>• Configurable animation speeds</li>
                <li>• Various color schemes including gradients</li>
                <li>• Responsive sizing options</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Performance</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• GPU-accelerated animations</li>
                <li>• Optimized re-renders with AnimatePresence</li>
                <li>• Smooth 60fps animations</li>
                <li>• Minimal CPU usage</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Usage Example */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { AnimatedStageProgress } from '@/components/dashboard/AnimatedStageProgress';

const stages = [
  { id: '1', title: 'Lead', completed: true, active: false },
  { id: '2', title: 'Audit', completed: true, active: false },
  { id: '3', title: 'Quote', completed: false, active: true },
  { id: '4', title: 'Job', completed: false, active: false },
  { id: '5', title: 'Invoice', completed: false, active: false }
];

<AnimatedStageProgress
  stages={stages}
  layout="horizontal"
  colorScheme="blue"
  animationSpeed="normal"
  size="md"
  showConnectors={true}
  onStageClick={(stageId) => console.log('Stage clicked:', stageId)}
/>`}
          </pre>
        </Card>
      </div>
    </AppLayout>
  );
} 