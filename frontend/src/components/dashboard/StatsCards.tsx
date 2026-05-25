import { Stats } from '@/types';

interface StatsCardsProps {
  stats: Stats;
}

const cards = [
  { label: 'Total candidatures', key: 'total',         color: 'bg-blue-50   border-blue-200   text-blue-700'   },
  { label: 'Taux de réponse',    key: 'responseRate',  color: 'bg-purple-50 border-purple-200 text-purple-700', suffix: '%' },
  { label: 'À relancer',         key: 'toFollowUp',    color: 'bg-orange-50 border-orange-200 text-orange-700' },
] as const;

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ label, key, emoji, color, suffix }) => (
        <div key={key} className={`rounded-xl border p-5 ${color}`}>
          <div className="text-2xl mb-2">{emoji}</div>
          <div className="text-3xl font-bold">
            {stats[key]}{suffix ?? ''}
          </div>
          <div className="text-sm mt-1 opacity-75">{label}</div>
        </div>
      ))}
    </div>
  );
}