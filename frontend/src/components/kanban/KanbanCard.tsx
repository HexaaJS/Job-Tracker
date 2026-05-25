'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Application } from '@/types';
import Badge from '@/components/ui/Badge';

interface Props {
  app: Application;
  onEdit:   (app: Application) => void;
  onDelete: (id: string) => void;
}

export default function KanbanCard({ app, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: app._id,
  });

  const style = {
    transform:  CSS.Transform.toString(transform),
    transition,
    opacity:    isDragging ? 0.4 : 1,
    cursor:     isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow select-none"
    >
      <p className="font-medium text-gray-900 text-sm truncate">{app.company}</p>
      <p className="text-xs text-gray-500 mt-0.5 truncate">{app.position}</p>

      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 flex-wrap">
        {app.location && <span>{app.location}</span>}
        {app.source   && <span className="bg-gray-100 px-1.5 py-0.5 rounded">{app.source}</span>}
      </div>

      {app.followUpAt && new Date(app.followUpAt) <= new Date() && (
        <p className="text-xs text-orange-500 font-medium mt-2">
          Relance : {new Date(app.followUpAt).toLocaleDateString('fr-FR')}
        </p>
      )}

      {/* Boutons — stopPropagation pour ne pas déclencher le drag */}
      <div
        className="flex gap-2 mt-3 pt-2 border-t border-gray-100"
        onPointerDown={e => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(app)}
          className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(app._id)}
          className="text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          Supprimer
        </button>
        {app.url && (
          
            <a href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline ml-auto"
          >
            Offre
          </a>
        )}
      </div>
    </div>
  );
}