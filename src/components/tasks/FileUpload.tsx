
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export function FileUpload({ onFileUpload, label }: FileUploadProps) {
  return (
    <label className="flex-1">
      <div className="flex items-center gap-2 p-2 border-2 border-dashed rounded-lg hover:bg-gray-50 cursor-pointer">
        <Upload className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <input
        type="file"
        multiple
        className="hidden"
        onChange={onFileUpload}
        accept="image/*"
      />
    </label>
  );
}
