import mongoose, { Schema, Document, Model } from 'mongoose';
import { IApplication, ApplicationStatus } from '../types';

export interface IApplicationDocument extends IApplication, Document {}

const applicationSchema = new Schema<IApplicationDocument>(
  {
    company:  { type: String, required: [true, 'Entreprise requise'], trim: true },
    position: { type: String, required: [true, 'Poste requis'], trim: true },
    location: { type: String, trim: true },
    url:      { type: String, trim: true },
    status: {
      type: String,
      enum: ['En attente', 'Entretien planifié', 'Entretien passé', 'Offre reçue', 'Refusé', 'Abandonné'] as ApplicationStatus[],
      default: 'En attente',
    },
    appliedAt:  { type: Date, default: Date.now },
    followUpAt: { type: Date },
    notes:      { type: String },
    salary: {
      min:      { type: Number },
      max:      { type: Number },
      currency: { type: String, default: 'EUR' },
    },
    tags:   [{ type: String }],
    source: { type: String },
  },
  { timestamps: true }
);

applicationSchema.index({ status: 1 });
applicationSchema.index({ appliedAt: -1 });
applicationSchema.index({ followUpAt: 1 });

const Application: Model<IApplicationDocument> = mongoose.model<IApplicationDocument>(
  'Application',
  applicationSchema
);

export default Application;