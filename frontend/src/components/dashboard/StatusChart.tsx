'use client';

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Stats, ApplicationStatus } from '@/types';

interface StatusChartProps {
  stats: Stats;
}

// Couleurs hex pour recharts (pas Tailwind)
const CHART_COLORS: Record<ApplicationStatus, string> = {
  'En attente':         '#EAB308',
  'Entretien planifié': '#3B82F6',
  'Entretien passé':    '#8B5CF6',
  'Offre reçue':        '#22C55E',
  'Refusé':             '#EF4444',
  'Abandonné':          '#9CA3AF',
};

export default function StatusChart({ stats }: StatusChartProps) {
  const data = stats.byStatus.map(({ _id, count }) => ({
    name:  _id,
    value: count,
    color: CHART_COLORS[_id] ?? '#9CA3AF',
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        Aucune donnée à afficher
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [value, name]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}