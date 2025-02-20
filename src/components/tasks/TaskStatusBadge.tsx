
interface TaskStatusBadgeProps {
  status: 'pending' | 'acknowledged' | 'in_progress' | 'completed';
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${
      status === 'completed' ? 'bg-green-100 text-green-800' :
      status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
      status === 'acknowledged' ? 'bg-blue-100 text-blue-800' :
      'bg-yellow-100 text-yellow-800'
    }`}>
      {status.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')}
    </span>
  );
}
