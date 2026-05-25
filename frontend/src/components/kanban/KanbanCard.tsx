'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Application } from '@/types';

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
      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow select-none w-full overflow-hidden"
    >
      {/* Entreprise + poste */}
      <div className="space-y-0.5 mb-2">
        <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">{app.company}</p>
        <p className="text-xs text-gray-500 line-clamp-1">{app.position}</p>
      </div>

      {/* Tags localisation / source */}
      <div className="flex flex-wrap gap-1 mb-2">
        {app.location && (
          <span className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded truncate max-w-full">
            {app.location}
          </span>
        )}
        {app.source && (
          <span className="bg-blue-50 text-blue-600 text-xs px-1.5 py-0.5 rounded truncate max-w-full">
            {app.source}
          </span>
        )}
      </div>

      {/* Alerte relance */}
      {app.followUpAt && new Date(app.followUpAt) <= new Date() && (
        <p className="text-xs text-orange-500 font-medium mb-2 truncate">
          Relance : {new Date(app.followUpAt).toLocaleDateString('fr-FR')}
        </p>
      )}

      {/* Actions */}
      <div
        className="flex items-center gap-2 pt-2 border-t border-gray-100"
        onPointerDown={e => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(app)}
          className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
        >
          Modifier
        </button>
        <span className="text-gray-200 text-xs">|</span>
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
            className="text-xs text-blue-500 hover:text-blue-700 transition-colors ml-auto shrink-0"
          >
            Offre
          </a>
        )}
      </div>
    </div>
  );
}