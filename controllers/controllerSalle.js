import prisma from "../lib/prismaClient.js";
import { validateId } from "../middleware/validateId.js"; // Middleware pour valider les IDs
import { handlePrismaError } from "../utils/errorHandler.js"; // Gestion des erreurs Prisma
import Joi from "joi"; // Import de Joi pour la validation des données

// Schéma de validation pour les salles
const salleSchema = Joi.object({
  nom_salle: Joi.string().required(),
  capacite: Joi.number().integer().required(),
});

const salleController = {
  // Récupérer toutes les salles
  getAllSalles: async (req, res) => {
    try {
      const salles = await prisma.salle.findMany();
      if (salles.length === 0) {
        return res.status(404).json({ message: "Aucune salle trouvée" });
      }
      res.status(200).json({
        message: `${salles.length} salle(s) trouvée(s)`,
        salles,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des salles :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  },

  // Récupérer une salle par son ID
  getSalleById: [validateId, async (req, res) => {
    try {
      const { id } = req.params;

      const salle = await prisma.salle.findUnique({
        where: { id_salle: parseInt(id) },
      });
      if (!salle) {
        return res.status(404).json({ message: "Salle non trouvée" });
      }
      res.status(200).json(salle);
    } catch (error) {
      console.error("Erreur lors de la récupération de la salle :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }],

  // Créer une salle
  createSalle: async (req, res) => {
    try {
      // Validation des données avec Joi
      const { error } = salleSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { nom_salle, capacite } = req.body;

      const newSalle = await prisma.salle.create({
        data: { nom_salle, capacite },
      });

      res.status(201).json({
        message: "Salle créée avec succès",
        newSalle,
      });
    } catch (error) {
      console.error("Erreur lors de la création de la salle :", error);
      handlePrismaError(error, res);
    }
  },

  // Mettre à jour une salle
  updateSalle: [validateId, async (req, res) => {
    try {
      const { id } = req.params;

      // Validation des données avec Joi
      const { error } = salleSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { nom_salle, capacite } = req.body;

      const updatedSalle = await prisma.salle.update({
        where: { id_salle: parseInt(id) },
        data: { nom_salle, capacite },
      });

      res.status(200).json({
        message: "Salle mise à jour avec succès",
        updatedSalle,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la salle :", error);
      handlePrismaError(error, res);
    }
  }],

  // Supprimer une salle
  deleteSalle: [validateId, async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.salle.delete({
        where: { id_salle: parseInt(id) },
      });

      res.status(204).json({ message: "Salle supprimée avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression de la salle :", error);
      handlePrismaError(error, res);
    }
  }],
};

export default salleController;