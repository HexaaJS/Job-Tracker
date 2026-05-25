'use client';

import { useApplications } from '@/hooks/useApplications';
import StatsCards  from '@/components/dashboard/StatsCards';
import StatusChart from '@/components/dashboard/StatusChart';
import Badge       from '@/components/ui/Badge';

export default function DashboardPage() {
  const { applications, stats, loading, error } = useApplications();

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Chargement...
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
      {error}
    </div>
  );

  // Candidatures à relancer (followUpAt dépassé)
  const toFollowUp = applications.filter(a =>
    a.followUpAt &&
    new Date(a.followUpAt) <= new Date() &&
    !['Refusé', 'Abandonné', 'Offre reçue'].includes(a.status)
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Cartes stats */}
      {stats && <StatsCards stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition par statut
          </h2>
          {stats && <StatusChart stats={stats} />}
        </div>

        {/* Alertes relances */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            À relancer
            {toFollowUp.length > 0 && (
              <span className="ml-2 bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {toFollowUp.length}
              </span>
            )}
          </h2>

          {toFollowUp.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucune relance en attente</p>
          ) : (
            <ul className="space-y-3">
              {toFollowUp.map(app => (
                <li key={app._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{app.company}</p>
                    <p className="text-gray-500 text-xs">{app.position}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={app.status} />
                    <span className="text-xs text-orange-600 font-medium">
                      {new Date(app.followUpAt!).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Dernières candidatures */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dernières candidatures
        </h2>
        <div className="space-y-3">
          {applications.slice(0, 5).map(app => (
            <div key={app._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{app.company}</p>
                <p className="text-sm text-gray-500">{app.position}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={app.status} />
                <span className="text-xs text-gray-400">
                  {new Date(app.appliedAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}