import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

import applicationRoutes from './routes/applicationRoutes';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const app: Application = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/applications', applicationRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Job Tracker API running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});