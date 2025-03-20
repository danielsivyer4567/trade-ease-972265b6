interface TaskStatusBadgeProps {
  status: 'pending' | 'acknowledged' | 'in_progress' | 'completed';
}
export function TaskStatusBadge({
  status
}: TaskStatusBadgeProps) {
  return <span className="">
      {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>;
}