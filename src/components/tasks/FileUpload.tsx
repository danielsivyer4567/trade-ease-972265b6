import { Upload, Image, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  allowGcpVision?: boolean;
  onTextExtracted?: (text: string, filename: string) => void;
}
export function FileUpload({
  onFileUpload,
  label,
  allowGcpVision = false,
  onTextExtracted
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Create a synthetic event to match the onChange interface
      const event = {
        target: {
          files: files as unknown as FileList
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      if (allowGcpVision && isImageFile(files[0])) {
        analyzeImageWithVision(files[0], event);
      } else {
        onFileUpload(event);
      }
    }
  };
  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };
  const isPdfFile = (file: File) => {
    return file.type === 'application/pdf';
  };
  const analyzeImageWithVision = async (file: File, originalEvent: React.ChangeEvent<HTMLInputElement>) => {
    setIsAnalyzing(true);
    try {
      // Get the messaging accounts to find the GCP Vision API key
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to use the Vision API');
        onFileUpload(originalEvent);
        return;
      }
      const {
        data: accounts,
        error
      } = await supabase.from('messaging_accounts').select('*').eq('user_id', session.user.id).eq('service_type', 'gcpvision').single();
      if (error || !accounts) {
        console.error('Error fetching GCP Vision account:', error);
        toast.error('GCP Vision API is not configured. Connect it in the Integrations page.');
        onFileUpload(originalEvent);
        return;
      }

      // Convert the image to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result as string;
        const apiKey = accounts.gcp_vision_key || accounts.api_key;
        if (!apiKey) {
          toast.error('No GCP Vision API key found');
          onFileUpload(originalEvent);
          setIsAnalyzing(false);
          return;
        }

        // Call the Supabase edge function to analyze the image
        const {
          data,
          error
        } = await supabase.functions.invoke('gcp-vision-analyze', {
          body: {
            imageBase64: base64Image,
            apiKey: apiKey
          }
        });
        if (error) {
          console.error('Error calling GCP Vision API:', error);
          toast.error('Failed to analyze image with Google Cloud Vision');
        } else if (data.success) {
          toast.success('Image analyzed with Google Cloud Vision');
          if (data.data.responses && data.data.responses[0].textAnnotations) {
            const extractedText = data.data.responses[0].textAnnotations[0]?.description;
            if (extractedText && onTextExtracted) {
              onTextExtracted(extractedText, file.name);
              toast.info(`Text extracted and added to financials`);
            }
          }
          if (data.data.responses && data.data.responses[0].labelAnnotations) {
            const labels = data.data.responses[0].labelAnnotations.slice(0, 5).map((label: any) => `${label.description} (${Math.round(label.score * 100)}%)`).join(', ');
            if (labels) {
              toast.info(`Detected: ${labels}`);
            }
          }
        } else {
          toast.error('Failed to analyze image');
        }

        // Continue with the normal file upload regardless of analysis result
        onFileUpload(originalEvent);
        setIsAnalyzing(false);
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
        onFileUpload(originalEvent);
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error('Error in Vision API process:', error);
      toast.error('An error occurred during image analysis');
      onFileUpload(originalEvent);
      setIsAnalyzing(false);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      if (allowGcpVision && (isImageFile(files[0]) || isPdfFile(files[0]))) {
        analyzeImageWithVision(files[0], e);
      } else {
        onFileUpload(e);
      }
    }
  };
  return <label onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className="bg-slate-950 rounded-lg">
      <div className="bg-slate-300">
        {allowGcpVision ? <Image className="h-10 w-10 text-blue-500 bg-transparent" /> : <Upload className="h-10 w-10 text-gray-400" />}
        <span className="text-sm text-center text-gray-950">
          {isAnalyzing ? "Analyzing with Google Cloud Vision..." : isDragging ? "Drop files here..." : label}
        </span>
        <span className="text-xs text-gray-950">
          Drag & drop or click to browse
          {allowGcpVision && " (Text extraction enabled)"}
        </span>
        {isAnalyzing && <div className="mt-2 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
            <span className="ml-2 text-xs text-blue-500">Processing file...</span>
          </div>}
      </div>
      <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.csv,.jpg,.jpeg,.png,.mp4,.mov" multiple />
    </label>;
}