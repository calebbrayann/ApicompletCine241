import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { clientSchema } from "../schemas/validationSchemas.js"; // Import du schéma Joi pour les clients
import { handlePrismaError } from "../utils/errorHandler.js"; // Gestion des erreurs Prisma

const prisma = new PrismaClient();

const authController = {
  // Créer un nouveau client
  register: async (req, res) => {
    try {
      // Validation des données avec Joi
      const { error } = clientSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { nom, prenom, e_mail, mot_de_passe, genre } = req.body;

      // Vérification de l'existence de l'email
      const existingClient = await prisma.client.findUnique({ where: { e_mail } });
      if (existingClient) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

      // Création du client
      const client = await prisma.client.create({
        data: { nom, prenom, e_mail, mot_de_passe: hashedPassword, genre },
      });

      console.log("Client enregistré avec succès");
      res.status(201).json({
        message: "Client enregistré avec succès",
        client: { id_client: client.id_client, nom: client.nom, e_mail: client.e_mail },
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du client :", error);
      handlePrismaError(error, res); // Gestion des erreurs Prisma
    }
  },

  // Connexion au compte utilisateur
  login: async (req, res) => {
    try {
      const { e_mail, mot_de_passe } = req.body;

      // Validation des données avec Joi
      if (!e_mail || !mot_de_passe) {
        return res.status(400).json({ message: "Les champs 'e_mail' et 'mot_de_passe' sont requis" });
      }

      // Vérification de l'existence du client
      const client = await prisma.client.findUnique({ where: { e_mail } });
      if (!client) {
        return res.status(400).json({ message: "Email ou mot de passe incorrect" });
      }

      // Comparaison des mots de passe
      const isMatch = await bcrypt.compare(mot_de_passe, client.mot_de_passe);
      if (!isMatch) {
        return res.status(400).json({ message: "Email ou mot de passe incorrect" });
      }

      // Vérification de la clé secrète JWT
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET n'est pas défini");
        return res.status(500).json({ message: "Erreur interne du serveur" });
      }

      // Génération du token JWT
      const token = jwt.sign({ id: client.id_client }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });

      console.log("Connexion réussie");
      res.json({ message: "Connexion réussie", token });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  },

  // Vérifier le token JWT
  verifyToken: (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      if (!token) {
        return res.status(401).json({ message: "Token manquant" });
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Token invalide ou expiré" });
        }
        req.clientId = decoded.id;
        next();
      });
    } catch (error) {
      console.error("Erreur lors de la vérification du token :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  },

  // Déconnexion de l'utilisateur
  logout: (req, res) => {
    try {
      console.log("Déconnexion réussie");
      res.json({ message: "Déconnexion réussie" });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  },
};

export default authController;