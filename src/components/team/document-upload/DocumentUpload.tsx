
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { GeneralDocumentUpload } from './GeneralDocumentUpload';
import { InsuranceDocumentUpload } from './InsuranceDocumentUpload';
import { JobRelatedDocumentUpload } from './JobRelatedDocumentUpload';
import { useIsMobile } from '@/hooks/use-mobile';

export const DocumentUpload: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const isMobile = useIsMobile();
  
  return (
    <div className={`w-full ${isMobile ? 'p-2' : 'p-4'} bg-white rounded-lg shadow-md`}>
      <h2 className={`${isMobile ? 'text-lg mb-2' : 'text-xl mb-4'} font-semibold text-gray-800`}>
        Document Management
      </h2>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-3'} w-full mb-4`}>
          <TabsTrigger value="general" className={`${isMobile ? 'py-1' : 'py-2'}`}>
            General Documents
          </TabsTrigger>
          <TabsTrigger value="insurance" className={`${isMobile ? 'py-1' : 'py-2'}`}>
            Insurance
          </TabsTrigger>
          <TabsTrigger value="job" className={`${isMobile ? 'py-1' : 'py-2'}`}>
            Job Related
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <GeneralDocumentUpload />
        </TabsContent>
        
        <TabsContent value="insurance" className="space-y-4">
          <InsuranceDocumentUpload />
        </TabsContent>
        
        <TabsContent value="job" className="space-y-4">
          <JobRelatedDocumentUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
};
