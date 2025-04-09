import prisma from "../lib/prismaClient.js";
import { validateId } from "../middleware/validateId.js"; // Middleware pour valider les IDs
import { handlePrismaError } from "../utils/errorHandler.js"; // Gestion des erreurs Prisma
import Joi from "joi"; // Import de Joi pour la validation des données

// Schéma de validation pour les séances
const seanceSchema = Joi.object({
  date_projection: Joi.date().required(),
  heure_projection: Joi.string().required(),
  id_salle: Joi.number().integer().required(),
  id_film: Joi.number().integer().required(),
});

const seanceController = {
  // Récupérer toutes les séances
  getAllSeances: async (req, res) => {
    try {
      const seances = await prisma.seance.findMany();
      if (seances.length === 0) {
        return res.status(404).json({ message: "Aucune séance trouvée" });
      }
      res.status(200).json({
        message: `${seances.length} séance(s) trouvée(s)`,
        seances,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des séances :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  },

  // Récupérer une séance par son ID
  getSeanceById: [validateId, async (req, res) => {
    try {
      const { id } = req.params;

      const seance = await prisma.seance.findUnique({
        where: { id_seance: parseInt(id) },
      });
      if (!seance) {
        return res.status(404).json({ message: "Séance non trouvée" });
      }
      res.status(200).json(seance);
    } catch (error) {
      console.error("Erreur lors de la récupération de la séance :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }],

  // Créer une séance
  createSeance: async (req, res) => {
    try {
      // Validation des données avec Joi
      const { error } = seanceSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { date_projection, heure_projection, id_salle, id_film } = req.body;

      const newSeance = await prisma.seance.create({
        data: { date_projection, heure_projection, id_salle, id_film },
      });

      res.status(201).json({
        message: "Séance créée avec succès",
        newSeance,
      });
    } catch (error) {
      console.error("Erreur lors de la création de la séance :", error);
      handlePrismaError(error, res);
    }
  },

  // Mettre à jour une séance
  updateSeance: [validateId, async (req, res) => {
    try {
      const { id } = req.params;

      // Validation des données avec Joi
      const { error } = seanceSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { date_projection, heure_projection, id_salle, id_film } = req.body;

      const updatedSeance = await prisma.seance.update({
        where: { id_seance: parseInt(id) },
        data: { date_projection, heure_projection, id_salle, id_film },
      });

      res.status(200).json({
        message: "Séance mise à jour avec succès",
        updatedSeance,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la séance :", error);
      handlePrismaError(error, res);
    }
  }],

  // Supprimer une séance
  deleteSeance: [validateId, async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.seance.delete({
        where: { id_seance: parseInt(id) },
      });

      res.status(204).json({ message: "Séance supprimée avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression de la séance :", error);
      handlePrismaError(error, res);
    }
  }],

  // Récupérer le statut des places pour une séance
  getSeancePlacesStatus: [validateId, async (req, res) => {
    try {
      const { id } = req.params; // ID de la séance

      // Récupérer toutes les places de la salle pour cette séance
      const places = await prisma.place_cine.findMany({
        where: {
          id_salle: (
            await prisma.seance.findUnique({
              where: { id_seance: parseInt(id) },
              select: { id_salle: true },
            })
          )?.id_salle,
        },
        select: {
          id_place: true,
          numero_place: true,
          niveau: true,
        },
      });

      if (!places) {
        return res.status(404).json({ message: "Salle non trouvée pour cette séance." });
      }

      // Récupérer toutes les réservations pour cette séance
      const reservations = await prisma.reservation.findMany({
        where: {
          id_seance: parseInt(id),
        },
        select: {
          id_place: true,
        },
      });

      // Créer un set des IDs des places réservées pour une recherche rapide
      const reservedPlaceIds = new Set(reservations.map((res) => res.id_place));

      // Mapper les places pour indiquer leur statut (réservée ou disponible)
      const placesStatus = places.map((place) => ({
        ...place,
        isReserved: reservedPlaceIds.has(place.id_place),
      }));

      res.status(200).json({
        message: `Statut de ${placesStatus.length} places pour la séance ${id}`,
        places: placesStatus,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du statut des places de la séance :", error);
      handlePrismaError(error, res);
    }
  }],
};

// Exporter le contrôleur
export default seanceController;