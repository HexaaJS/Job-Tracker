import { ApplicationStatus, STATUS_COLORS } from '@/types';

interface BadgeProps {
  status: ApplicationStatus;
}

export default function Badge({ status }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
}