
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building } from 'lucide-react';
import { toast } from 'sonner';

const DemoDataGenerator: React.FC = () => {
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);

  const handleGenerateDemoData = async () => {
    setIsGeneratingDemo(true);
    try {
      const { generateDemoData } = await import("@/integrations/supabase/client");
      const result = await generateDemoData();
      
      if (result && !result.error) {
        toast.success('Demo organizations and users created successfully!');
      } else {
        throw new Error('Failed to create demo data');
      }
    } catch (error) {
      console.error('Error generating demo data:', error);
      toast.error('Failed to generate demo data. See console for details.');
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 text-center">Developer Options</h3>
          <Button 
            onClick={handleGenerateDemoData} 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            disabled={isGeneratingDemo}
          >
            {isGeneratingDemo ? (
              <>Generating Demo Data...</>
            ) : (
              <>
                <Building className="h-4 w-4" />
                Generate 3 Sample Organizations
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            This will create 3 random organizations with 3 users each.<br />
            Each organization will have an owner, admin, and member.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoDataGenerator;
