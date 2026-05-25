import { Request, Response } from 'express';
import Application from '../models/Application';

export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, source, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { company:  { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await Application.find(filter).sort({ appliedAt: -1 });
    res.json(applications);
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      res.status(404).json({ message: 'Candidature non trouvée' });
      return;
    }
    res.json(application);
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = new Application(req.body);
    const saved = await application.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const updateApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!application) {
      res.status(404).json({ message: 'Candidature non trouvée' });
      return;
    }
    res.json(application);
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      res.status(404).json({ message: 'Candidature non trouvée' });
      return;
    }
    res.json({ message: 'Candidature supprimée' });
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const byStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const toFollowUp = await Application.countDocuments({
      followUpAt: { $lte: new Date() },
      status: { $nin: ['Refusé', 'Abandonné', 'Offre reçue'] },
    });

    const total    = await Application.countDocuments();
    const answered = await Application.countDocuments({
      status: { $in: ['Entretien planifié', 'Entretien passé', 'Offre reçue', 'Refusé'] },
    });

    res.json({
      byStatus,
      toFollowUp,
      total,
      responseRate: total > 0 ? Math.round((answered / total) * 100) : 0,
    });
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};