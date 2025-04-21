import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FolderOpen, ListPlus, Gauge, Wrench } from 'lucide-react';

export const WorkflowNavigation = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <Link to="/workflow/list" className="flex-1">
        <Button variant="outline" className="w-full">
          <FolderOpen className="mr-2 h-4 w-4" />
          My Workflows
        </Button>
      </Link>
      <Link to="/workflow/templates" className="flex-1">
        <Button variant="outline" className="w-full">
          <ListPlus className="mr-2 h-4 w-4" />
          Templates
        </Button>
      </Link>
      <Link to="/workflow/metrics" className="flex-1">
        <Button variant="outline" className="w-full">
          <Gauge className="mr-2 h-4 w-4" />
          Metrics
        </Button>
      </Link>
      <Link to="/workflow/maintenance" className="flex-1">
        <Button variant="outline" className="w-full">
          <Wrench className="mr-2 h-4 w-4" />
          Maintenance
        </Button>
      </Link>
    </div>
  );
};
