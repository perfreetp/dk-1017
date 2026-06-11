interface BadgeProps {
  status: string;
  type?: 'booking' | 'workorder' | 'complaint' | 'lostitem' | 'cruise' | 'guide';
}

interface StatusConfigValue {
  label: string;
  class: string;
}

type StatusConfig = Record<string, Record<string, StatusConfigValue>>;

const statusConfig: StatusConfig = {
  booking: {
    pending: { label: '待核销', class: 'bg-yellow-100 text-yellow-700' },
    verified: { label: '已核销', class: 'bg-green-100 text-green-700' },
    cancelled: { label: '已取消', class: 'bg-slate-100 text-slate-600' },
  },
  workorder: {
    pending: { label: '待处理', class: 'bg-yellow-100 text-yellow-700' },
    processing: { label: '处理中', class: 'bg-blue-100 text-blue-700' },
    completed: { label: '已完成', class: 'bg-green-100 text-green-700' },
  },
  complaint: {
    pending: { label: '待分派', class: 'bg-yellow-100 text-yellow-700' },
    assigned: { label: '已分派', class: 'bg-blue-100 text-blue-700' },
    resolved: { label: '已解决', class: 'bg-green-100 text-green-700' },
  },
  lostitem: {
    unclaimed: { label: '待认领', class: 'bg-yellow-100 text-yellow-700' },
    claimed: { label: '已认领', class: 'bg-green-100 text-green-700' },
  },
  cruise: {
    available: { label: '待发船', class: 'bg-green-100 text-green-700' },
    sailing: { label: '航行中', class: 'bg-blue-100 text-blue-700' },
    maintenance: { label: '维护中', class: 'bg-red-100 text-red-700' },
  },
  guide: {
    available: { label: '空闲', class: 'bg-green-100 text-green-700' },
    busy: { label: '服务中', class: 'bg-blue-100 text-blue-700' },
    off: { label: '休息', class: 'bg-slate-100 text-slate-600' },
  },
};

export default function Badge({ status, type = 'booking' }: BadgeProps) {
  const config = statusConfig[type]?.[status] || { label: status, class: 'bg-slate-100 text-slate-600' };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
      {config.label}
    </span>
  );
}