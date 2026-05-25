'use client';

import { useState } from 'react';
import { useApplications } from '@/hooks/useApplications';
import { Application, ApplicationStatus } from '@/types';
import KanbanBoard     from '@/components/kanban/KanbanBoard';
import ApplicationForm from '@/components/applications/ApplicationForm';

export default function KanbanPage() {
  const { applications, loading, error, update, remove } = useApplications();
  const [editing,  setEditing]  = useState<Application | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await update(id, { status });
  };

  const handleEdit = (app: Application) => {
    setEditing(app);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette candidature ?')) {
      await remove(id);
    }
  };

  const handleSubmit = async (data: Omit<Application, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (editing) await update(editing._id, data);
    setShowForm(false);
    setEditing(null);
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Chargement...</div>;
  if (error)   return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kanban</h1>
        <p className="text-sm text-gray-400">{applications.length} candidatures</p>
      </div>

      <KanbanBoard
        applications={applications}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <ApplicationForm
          initial={editing}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}