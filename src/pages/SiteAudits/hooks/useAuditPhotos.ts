
import { useState } from 'react';
import { Audit } from '../types/auditTypes';
import { useToast } from '@/hooks/use-toast';

export const useAuditPhotos = (
  audits: Audit[],
  setAudits: React.Dispatch<React.SetStateAction<Audit[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();

  const uploadAuditPhoto = async (customerId: string, file: File) => {
    // Simulate API call
    setIsLoading(true);
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful upload
        setAudits(prevAudits => {
          const existingAudit = prevAudits.find(a => a.customerId === customerId);
          
          if (existingAudit) {
            // Add photo to existing audit
            return prevAudits.map(audit => {
              if (audit.customerId === customerId) {
                return {
                  ...audit,
                  photos: [...audit.photos, {
                    id: `photo-${Date.now()}`,
                    url: URL.createObjectURL(file),
                    name: file.name,
                    uploadedAt: new Date().toISOString()
                  }]
                };
              }
              return audit;
            });
          } else {
            // No matching audit found
            reject(new Error("No audit found for this customer"));
          }
          
          return prevAudits;
        });
        
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  };

  return { uploadAuditPhoto };
};
