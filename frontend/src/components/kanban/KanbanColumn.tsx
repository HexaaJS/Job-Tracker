'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Application, ApplicationStatus } from '@/types';
import KanbanCard from './KanbanCard';

// Couleur du header par statut
const COLUMN_COLORS: Record<ApplicationStatus, string> = {
  'En attente':         'bg-yellow-50  border-yellow-200',
  'Entretien planifié': 'bg-blue-50    border-blue-200',
  'Entretien passé':    'bg-purple-50  border-purple-200',
  'Offre reçue':        'bg-green-50   border-green-200',
  'Refusé':             'bg-red-50     border-red-200',
  'Abandonné':          'bg-gray-50    border-gray-200',
};

const HEADER_COLORS: Record<ApplicationStatus, string> = {
  'En attente':         'text-yellow-700',
  'Entretien planifié': 'text-blue-700',
  'Entretien passé':    'text-purple-700',
  'Offre reçue':        'text-green-700',
  'Refusé':             'text-red-700',
  'Abandonné':          'text-gray-600',
};

interface Props {
  status:   ApplicationStatus;
  apps:     Application[];
  onEdit:   (app: Application) => void;
  onDelete: (id: string) => void;
}

export default function KanbanColumn({ status, apps, onEdit, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col rounded-xl border p-3 min-h-32 transition-colors
        ${COLUMN_COLORS[status]}
        ${isOver ? 'ring-2 ring-gray-400 ring-offset-1' : ''}
      `}
    >
      {/* Header colonne */}
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-xs font-semibold uppercase tracking-wide ${HEADER_COLORS[status]}`}>
          {status}
        </h3>
        <span className="text-xs font-medium bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-600">
          {apps.length}
        </span>
      </div>

      {/* Cards */}
      <SortableContext items={apps.map(a => a._id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 flex-1">
          {apps.map(app => (
            <KanbanCard
              key={app._id}
              app={app}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {apps.length === 0 && (
            <div className="flex-1 flex items-center justify-center py-6 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              Deposer ici
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}