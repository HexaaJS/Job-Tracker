import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    // TS strict mode : on vérifie que la variable existe
    if (!mongoUri) {
      throw new Error('MONGO_URI manquant dans les variables d\'environnement');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    // En TS, le 'error' dans catch est de type 'unknown', pas 'Error'
    // Il faut le typer explicitement avant d'accéder à .message
    if (error instanceof Error) {
      console.error(`❌ Erreur MongoDB: ${error.message}`);
    }
    process.exit(1);
  }
};

export default connectDB;