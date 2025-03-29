
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';

interface PageHeaderProps {
  onFileUploadClick: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ onFileUploadClick }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Property Boundaries</h1>
        <p className="text-muted-foreground">
          Manage and view your property boundaries
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={onFileUploadClick} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Boundary
        </Button>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </div>
    </div>
  );
};
