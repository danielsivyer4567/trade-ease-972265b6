
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useFileUpload = (jobId: string) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFileToStorage = async (file: File): Promise<string> => {
    if (!file || !jobId) {
      throw new Error("File and jobId are required");
    }
    
    setIsUploading(true);
    setUploadProgress(10); // Start progress indication
    
    try {
      // Check if job-documents bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      if (bucketError) {
        console.error("Error listing buckets:", bucketError);
      } else {
        const jobDocumentsBucket = buckets.find(b => b.name === 'job-documents');
        if (!jobDocumentsBucket) {
          console.log("Creating job-documents bucket");
          const { error: createError } = await supabase.storage.createBucket('job-documents', {
            public: true
          });
          if (createError) {
            console.error("Error creating bucket:", createError);
            throw new Error("Storage system not configured properly");
          }
        }
      }
      
      // Upload file
      const fileName = `${jobId}_${Date.now()}_${file.name}`;
      const filePath = `${jobId}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('job-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error("Upload error:", uploadError);
        // More specific error message based on the type of error
        if (uploadError.message.includes("bucket") || uploadError.message.includes("404")) {
          throw new Error("Storage system not available. Please contact your administrator.");
        }
        throw new Error(`Error uploading document: ${uploadError.message}`);
      }
      
      setUploadProgress(50); // Upload complete
      return filePath;
    } catch (error) {
      console.error("File upload error:", error);
      throw error;
    }
  };

  return {
    uploadProgress,
    setUploadProgress,
    isUploading,
    setIsUploading,
    uploadFileToStorage
  };
};
