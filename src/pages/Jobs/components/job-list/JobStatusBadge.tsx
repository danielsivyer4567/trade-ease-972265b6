import { Badge } from "@/components/ui/badge";
import type { Job } from "@/types/job";
import { Check, Clock, AlertCircle, CreditCard } from "lucide-react";

interface JobStatusBadgeProps {
  status: Job['status'];
}

export const JobStatusBadge = ({ status }: JobStatusBadgeProps) => {
  const getStatusConfig = (status: Job['status']) => {
    switch (status) {
      case 'in-progress':
        return {
          color: 'bg-blue-50 text-blue-700 border border-blue-200',
          icon: <Clock className="h-3 w-3 mr-1" />,
          label: 'In Progress'
        };
      case 'to-invoice':
        return {
          color: 'bg-green-50 text-green-700 border border-green-200',
          icon: <Check className="h-3 w-3 mr-1" />,
          label: 'Completed'
        };
      case 'invoiced':
        return {
          color: 'bg-purple-50 text-purple-700 border border-purple-200',
          icon: <CreditCard className="h-3 w-3 mr-1" />,
          label: 'Invoiced'
        };
      default:
        return {
          color: 'bg-amber-50 text-amber-700 border border-amber-200',
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          label: 'Ready'
        };
    }
  };

  const { color, icon, label } = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {label}
    </div>
  );
};
