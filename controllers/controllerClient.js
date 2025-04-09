import prisma from "../lib/prismaClient.js";
import bcrypt from "bcryptjs";
import { clientSchema } from "../schemas/validationSchemas.js"; // Import du schéma Joi pour les clients
import { validateId } from "../middleware/validateId.js"; // Middleware pour valider les IDs
import verifyToken from "../middleware/authMiddleware.js"; // Import du middleware d'authentification
import { handlePrismaError } from "../utils/errorHandler.js"; // Gestion des erreurs Prisma

const clientController = {
  // Récupérer tous les clients
  getAllClients: [verifyToken, async (req, res) => { // Ajout de verifyToken pour protéger la route
    try {
      const clients = await prisma.client.findMany();
      if (clients.length === 0) {
        return res.status(404).json({ message: "Aucun client trouvé" });
      }
      res.status(200).json({
        message: `${clients.length} client(s) trouvé(s)`,
        clients,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des clients :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }],

  // Récupérer un client par son ID
  getClientById: [verifyToken, validateId, async (req, res) => { // Ajout de verifyToken pour protéger la route
    try {
      const { id } = req.params;

      if (parseInt(id) !== req.clientId) {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à consulter cet utilisateur." });
      }

      const client = await prisma.client.findUnique({
        where: { id_client: parseInt(id) },
      });
      if (!client) {
        return res.status(404).json({ message: "Client non trouvé" });
      }
      res.status(200).json(client);
    } catch (error) {
      console.error("Erreur lors de la récupération du client :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }],

  // Mettre à jour un client
  updateClient: [verifyToken, validateId, async (req, res) => { // Ajout de verifyToken pour protéger la route
    try {
      const { id } = req.params;

      if (parseInt(id) !== req.clientId) {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cet utilisateur." });
      }

      // Validation des données avec Joi
      const { error } = clientSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { nom, prenom, e_mail, mot_de_passe, genre } = req.body;

      // Hachage du mot de passe si fourni
      let hashedPassword = null;
      if (mot_de_passe) {
        hashedPassword = await bcrypt.hash(mot_de_passe, 10);
      }

      // Mise à jour des données
      const updatedClient = await prisma.client.update({
        where: { id_client: parseInt(id) },
        data: {
          ...(nom && { nom }),
          ...(prenom && { prenom }),
          ...(e_mail && { e_mail }),
          ...(mot_de_passe && { mot_de_passe: hashedPassword }),
          ...(genre && { genre }),
        },
      });

      res.status(200).json({
        message: "Client mis à jour avec succès",
        updatedClient,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client :", error);

      // Gestion des erreurs Prisma (par exemple, email en double)
      handlePrismaError(error, res);
    }
  }],

  // Supprimer un client
  deleteClient: [verifyToken, validateId, async (req, res) => { // Ajout de verifyToken pour protéger la route
    try {
      const { id } = req.params;

      if (parseInt(id) !== req.clientId) {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cet utilisateur." });
      }

      await prisma.client.delete({
        where: { id_client: parseInt(id) },
      });
      res.status(204).json({ message: "Client supprimé avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression du client :", error);

      // Gestion des erreurs Prisma (par exemple, client non trouvé)
      handlePrismaError(error, res);
    }
  }],
};

export default clientController;