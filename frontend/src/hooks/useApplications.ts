'use client';

import { useState, useEffect, useCallback } from 'react';
import { Application, Stats } from '@/types';
import * as api from '@/lib/api';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats]               = useState<Stats | null>(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  const load = useCallback(async (params?: { status?: string; search?: string }) => {
    try {
      setLoading(true);
      const [apps, s] = await Promise.all([
        api.fetchApplications(params),
        api.fetchStats(),
      ]);
      setApplications(apps);
      setStats(s);
    } catch {
      setError('Impossible de charger les candidatures');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async (payload: Parameters<typeof api.createApplication>[0]) => {
    const newApp = await api.createApplication(payload);
    setApplications(prev => [newApp, ...prev]);
    load(); // recharge les stats
  };

  const update = async (id: string, payload: Partial<Application>) => {
    const updated = await api.updateApplication(id, payload);
    setApplications(prev => prev.map(a => a._id === id ? updated : a));
    load();
  };

  const remove = async (id: string) => {
    await api.deleteApplication(id);
    setApplications(prev => prev.filter(a => a._id !== id));
    load();
  };

  return { applications, stats, loading, error, load, create, update, remove };
}