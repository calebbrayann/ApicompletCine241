import prisma from "../lib/prismaClient.js";
import { validateId } from "../middleware/validateId.js"; // Middleware pour valider les IDs
import { handlePrismaError } from "../utils/errorHandler.js"; // Gestion des erreurs Prisma
import Joi from "joi"; // Import de Joi pour la validation des données

// Schéma Joi pour valider les données des places de cinéma
const placeCineSchema = Joi.object({
  id_salle: Joi.number().integer().required(),
  numero_place: Joi.number().integer().required(),
  niveau: Joi.string().min(1).max(50).required(),
});

const place_cine = {
  // Récupérer toutes les places de cinéma
  getAllPlaces_Cine: async (req, res) => {
    try {
      const places_cine = await prisma.place_cine.findMany();
      if (places_cine.length === 0) {
        return res.status(404).json({ message: "Aucune place de cinéma trouvée" });
      }
      res.status(200).json({
        message: `${places_cine.length} place(s) de cinéma trouvée(s)`,
        places_cine,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des places de cinéma :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  },

  // Récupérer une place de cinéma par son ID
  getPlace_CineById: [validateId, async (req, res) => {
    try {
      const { id } = req.params;

      const place_cine = await prisma.place_cine.findUnique({
        where: { id_place: parseInt(id) },
      });
      if (!place_cine) {
        return res.status(404).json({ message: "Place de cinéma non trouvée" });
      }
      res.status(200).json(place_cine);
    } catch (error) {
      console.error("Erreur lors de la récupération de la place de cinéma :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }],

  // Créer une place de cinéma
  createPlace_Cine: async (req, res) => {
    try {
      // Validation des données avec Joi
      const { error } = placeCineSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { id_salle, numero_place, niveau } = req.body;

      const newPlace_Cine = await prisma.place_cine.create({
        data: { id_salle, numero_place, niveau },
      });

      res.status(201).json({
        message: "Place de cinéma créée avec succès",
        newPlace_Cine,
      });
    } catch (error) {
      console.error("Erreur lors de la création de la place de cinéma :", error);
      handlePrismaError(error, res);
    }
  },

  // Mettre à jour une place de cinéma
  updatePlace_Cine: [validateId, async (req, res) => {
    try {
      const { id } = req.params;

      // Validation des données avec Joi
      const { error } = placeCineSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { id_salle, numero_place, niveau } = req.body;

      const updatedPlace_Cine = await prisma.place_cine.update({
        where: { id_place: parseInt(id) },
        data: { id_salle, numero_place, niveau },
      });

      res.status(200).json({
        message: "Place de cinéma mise à jour avec succès",
        updatedPlace_Cine,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la place de cinéma :", error);
      handlePrismaError(error, res);
    }
  }],

  // Supprimer une place de cinéma
  deletePlace_Cine: [validateId, async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.place_cine.delete({
        where: { id_place: parseInt(id) },
      });

      res.status(204).json({ message: "Place de cinéma supprimée avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression de la place de cinéma :", error);
      handlePrismaError(error, res);
    }
  }],
};

export default place_cine;