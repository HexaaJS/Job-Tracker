export type ApplicationStatus =
  | 'En attente'
  | 'Entretien planifié'
  | 'Entretien passé'
  | 'Offre reçue'
  | 'Refusé'
  | 'Abandonné';

export interface IApplication {
  company: string;
  position: string;
  location?: string;
  url?: string;
  status: ApplicationStatus;
  appliedAt: Date;
  followUpAt?: Date;
  notes?: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  tags?: string[];
  source?: string;
}