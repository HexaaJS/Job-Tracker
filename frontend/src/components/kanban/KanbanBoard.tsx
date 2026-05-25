'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';
import { Application, ApplicationStatus } from '@/types';
import KanbanColumn from './KanbanColumn';
import KanbanCard   from './KanbanCard';

const STATUTS: ApplicationStatus[] = [
  'En attente',
  'Entretien planifié',
  'Entretien passé',
  'Offre reçue',
  'Refusé',
  'Abandonné',
];

interface Props {
  applications: Application[];
  onStatusChange: (id: string, status: ApplicationStatus) => Promise<void>;
  onEdit:         (app: Application) => void;
  onDelete:       (id: string) => void;
}

export default function KanbanBoard({ applications, onStatusChange, onEdit, onDelete }: Props) {
  const [activeApp, setActiveApp] = useState<Application | null>(null);

  // PointerSensor avec distance minimale — évite de déclencher le drag sur un simple clic
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const appsByStatus = (status: ApplicationStatus) =>
    applications.filter(a => a.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    const app = applications.find(a => a._id === event.active.id);
    setActiveApp(app ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveApp(null);

    if (!over) return;

    // 'over.id' peut être un statut (colonne) ou un _id de card
    // On cherche d'abord si c'est une colonne directement
    const targetStatus = STATUTS.includes(over.id as ApplicationStatus)
      ? (over.id as ApplicationStatus)
      : applications.find(a => a._id === over.id)?.status;

    if (!targetStatus) return;

    const draggedApp = applications.find(a => a._id === active.id);
    if (!draggedApp || draggedApp.status === targetStatus) return;

    await onStatusChange(draggedApp._id, targetStatus);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {STATUTS.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            apps={appsByStatus(status)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Card fantome pendant le drag */}
      <DragOverlay>
        {activeApp && (
          <div className="rotate-2 opacity-90">
            <KanbanCard
              app={activeApp}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}