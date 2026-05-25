export type ApplicationStatus =
  | 'En attente'
  | 'Entretien planifié'
  | 'Entretien passé'
  | 'Offre reçue'
  | 'Refusé'
  | 'Abandonné';

export interface Application {
  _id: string;
  company: string;
  position: string;
  location?: string;
  url?: string;
  status: ApplicationStatus;
  appliedAt: string;       // string côté frontend (JSON sérialise les dates)
  followUpAt?: string;
  notes?: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  tags?: string[];
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  byStatus: { _id: ApplicationStatus; count: number }[];
  toFollowUp: number;
  total: number;
  responseRate: number;
}

// Couleur associée à chaque statut — utilisée partout dans l'UI
export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  'En attente':         'bg-yellow-100 text-yellow-800',
  'Entretien planifié': 'bg-blue-100 text-blue-800',
  'Entretien passé':    'bg-purple-100 text-purple-800',
  'Offre reçue':        'bg-green-100 text-green-800',
  'Refusé':             'bg-red-100 text-red-800',
  'Abandonné':          'bg-gray-100 text-gray-800',
};