'use client';

import { useState } from 'react';
import { Application, ApplicationStatus } from '@/types';

const STATUTS: ApplicationStatus[] = [
  'En attente', 'Entretien planifié', 'Entretien passé',
  'Offre reçue', 'Refusé', 'Abandonné',
];

type FormData = Omit<Application, '_id' | 'createdAt' | 'updatedAt'>;

interface Props {
  initial?: Application | null;
  onSubmit: (data: FormData) => Promise<void>;
  onClose:  () => void;
}

export default function ApplicationForm({ initial, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<FormData>({
    company:    initial?.company    ?? '',
    position:   initial?.position   ?? '',
    location:   initial?.location   ?? '',
    url:        initial?.url        ?? '',
    status:     initial?.status     ?? 'En attente',
    appliedAt:  initial?.appliedAt  ? initial.appliedAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
    followUpAt: initial?.followUpAt ? initial.followUpAt.slice(0, 10) : '',
    notes:      initial?.notes      ?? '',
    source:     initial?.source     ?? '',
    tags:       initial?.tags       ?? [],
  });
  const [saving, setSaving] = useState(false);

  const set = (field: keyof FormData, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {initial ? 'Modifier' : 'Nouvelle candidature'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Entreprise *</label>
              <input
                required
                value={form.company}
                onChange={e => set('company', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Poste *</label>
              <input
                required
                value={form.position}
                onChange={e => set('position', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value as ApplicationStatus)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Source</label>
              <input
                value={form.source ?? ''}
                onChange={e => set('source', e.target.value)}
                placeholder="LinkedIn, Indeed..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date de candidature</label>
              <input
                type="date"
                value={form.appliedAt.slice(0, 10)}
                onChange={e => set('appliedAt', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date de relance</label>
              <input
                type="date"
                value={form.followUpAt?.slice(0, 10) ?? ''}
                onChange={e => set('followUpAt', e.target.value || undefined)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Localisation</label>
            <input
              value={form.location ?? ''}
              onChange={e => set('location', e.target.value)}
              placeholder="Paris, Remote..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">URL</label>
            <input
              type="url"
              value={form.url ?? ''}
              onChange={e => set('url', e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={form.notes ?? ''}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gray-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Sauvegarde...' : initial ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}