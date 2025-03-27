
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/types/job";

interface JobStatusBadgeProps {
  status: Job['status'];
}

export const JobStatusBadge = ({ status }: JobStatusBadgeProps) => {
  const getStatusBadgeColor = (status: Job['status']) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'to-invoice':
        return 'bg-green-500 hover:bg-green-600';
      case 'invoiced':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'clean-required':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Badge className={`${getStatusBadgeColor(status)}`}>
      {status}
    </Badge>
  );
};
