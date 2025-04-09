import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail', // Service configurable via .env
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Erreur de connexion SMTP :', error);
    // Optionnel : Arrêter l'application si la connexion échoue
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Échec de la connexion SMTP. Vérifiez vos configurations.');
    }
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Connexion SMTP réussie, prêt à envoyer des e-mails.');
    }
  }
});w