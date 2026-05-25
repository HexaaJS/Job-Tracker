'use client';

import { useState } from 'react';
import { useApplications } from '@/hooks/useApplications';
import { Application, ApplicationStatus } from '@/types';
import Badge from '@/components/ui/Badge';
import ApplicationForm from '@/components/applications/ApplicationForm';

const STATUTS: ApplicationStatus[] = [
  'En attente', 'Entretien planifié', 'Entretien passé',
  'Offre reçue', 'Refusé', 'Abandonné',
];

export default function ApplicationsPage() {
  const { applications, loading, error, load, create, update, remove } = useApplications();
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilter]   = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState<Application | null>(null);

  const filtered = applications.filter(a => {
    const matchSearch = !search ||
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.position.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSubmit = async (data: Omit<Application, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (editing) {
      await update(editing._id, data);
    } else {
      await create(data);
    }
    setShowForm(false);
    setEditing(null);
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

  if (loading) return <div className="text-center py-20 text-gray-400">Chargement...</div>;
  if (error)   return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Candidatures</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          + Ajouter
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <select
          value={filterStatus}
          onChange={e => setFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">Tous les statuts</option>
          {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          onClick={() => load()}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
        >
          Rafraichir
        </button>
      </div>

      {/* Compteur */}
      <p className="text-sm text-gray-500">
        {filtered.length} candidature{filtered.length > 1 ? 's' : ''}
      </p>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">
          Aucune candidature trouvée
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {filtered.map(app => (
            <div key={app._id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-gray-900 truncate">{app.company}</p>
                  <Badge status={app.status} />
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{app.position}</p>
                <div className="flex gap-3 mt-1 text-xs text-gray-400">
                  {app.location && <span>{app.location}</span>}
                  {app.source   && <span>{app.source}</span>}
                  <span>{new Date(app.appliedAt).toLocaleDateString('fr-FR')}</span>
                  {app.followUpAt && (
                    <span className={new Date(app.followUpAt) <= new Date() ? 'text-orange-500 font-medium' : ''}>
                      Relance : {new Date(app.followUpAt).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {app.url && (
                  
                    <a href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Offre
                  </a>
                )}
                <button
                  onClick={() => handleEdit(app)}
                  className="text-xs text-gray-500 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(app._id)}
                  className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal formulaire */}
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