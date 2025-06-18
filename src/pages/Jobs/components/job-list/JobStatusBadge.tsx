import { Badge } from "@/components/ui/badge";
import type { Job } from "@/types/job";
import { Check, Clock, AlertCircle, CreditCard } from "lucide-react";

interface JobStatusBadgeProps {
  status: Job['status'];
}

export const JobStatusBadge = ({ status }: JobStatusBadgeProps) => {
  const getStatusConfig = (status: Job['status']) => {
    switch (status) {
      case 'ready':
        return {
          label: 'Ready',
          variant: 'default' as const,
          icon: <Clock className="h-3 w-3 mr-1" />
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          variant: 'secondary' as const,
          icon: <AlertCircle className="h-3 w-3 mr-1" />
        };
      case 'to-invoice':
        return {
          label: 'To Invoice',
          variant: 'outline' as const,
          icon: <CreditCard className="h-3 w-3 mr-1" />
        };
      case 'invoiced':
        return {
          label: 'Invoiced',
          variant: 'default' as const,
          icon: <CreditCard className="h-3 w-3 mr-1" />
        };
      case 'completed':
        return {
          label: 'Completed',
          variant: 'default' as const,
          icon: <Check className="h-3 w-3 mr-1" />
        };
      default:
        return {
          label: status,
          variant: 'default' as const,
          icon: null
        };
    }
  };

  const { label, variant, icon } = getStatusConfig(status);

  return (
    <Badge variant={variant} className="flex items-center">
      {icon}
      {label}
    </Badge>
  );
};
