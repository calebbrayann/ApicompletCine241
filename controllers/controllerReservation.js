import prisma from "../lib/prismaClient.js";
import { validateId } from "../middleware/validateId.js"; // Middleware pour valider les IDs
import { handlePrismaError } from "../utils/errorHandler.js"; // Gestion des erreurs Prisma
import Joi from "joi"; // Import de Joi pour la validation des données
import verifyToken from "../middleware/authMiddleware.js"; // Import du middleware d'authentification

// Schéma de validation pour les réservations
const reservationSchema = Joi.object({
  date_reservation: Joi.date().required(),
  nombre_place: Joi.number().integer().required(),
  paiement: Joi.string().required(),
  id_client: Joi.number().integer().required(),
  id_place: Joi.number().integer().required(),
});

const reservationController = {
  // Récupérer toutes les réservations
  getAllReservations: async (req, res) => {
    try {
      const reservations = await prisma.reservation.findMany();
      if (reservations.length === 0) {
        return res.status(404).json({ message: "Aucune réservation trouvée" });
      }
      res.status(200).json({
        message: `${reservations.length} réservation(s) trouvée(s)`,
        reservations,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  },

  // Récupérer une réservation par son ID
  getReservationById: [
    validateId,
    async (req, res) => {
      try {
        const { id } = req.params;

        const reservation = await prisma.reservation.findUnique({
          where: { id_reservation: parseInt(id) },
        });
        if (!reservation) {
          return res.status(404).json({ message: "Réservation non trouvée" });
        }
        res.status(200).json(reservation);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la réservation :",
          error
        );
        res.status(500).json({ message: "Erreur interne du serveur" });
      }
    },
  ],

  // Créer une réservation
  createReservation: async (req, res) => {
    try {
      // Validation des données avec Joi
      const { error } = reservationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { date_reservation, nombre_place, paiement, id_client, id_place } =
        req.body;

      const newReservation = await prisma.reservation.create({
        data: { date_reservation, nombre_place, paiement, id_client, id_place },
      });

      res.status(201).json({
        message: "Réservation créée avec succès",
        newReservation,
      });
    } catch (error) {
      console.error("Erreur lors de la création de la réservation :", error);
      handlePrismaError(error, res);
    }
  },

  // Mettre à jour une réservation
  updateReservation: [
    validateId,
    async (req, res) => {
      try {
        const { id } = req.params;

        // Validation des données avec Joi
        const { error } = reservationSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }

        const {
          date_reservation,
          nombre_place,
          paiement,
          id_client,
          id_place,
        } = req.body;

        const updatedReservation = await prisma.reservation.update({
          where: { id_reservation: parseInt(id) },
          data: {
            date_reservation,
            nombre_place,
            paiement,
            id_client,
            id_place,
          },
        });

        res.status(200).json({
          message: "Réservation mise à jour avec succès",
          updatedReservation,
        });
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour de la réservation :",
          error
        );
        handlePrismaError(error, res);
      }
    },
  ],

  // Supprimer une réservation
  deleteReservation: [
    validateId,
    async (req, res) => {
      try {
        const { id } = req.params;

        await prisma.reservation.delete({
          where: { id_reservation: parseInt(id) },
        });

        res.status(204).json({ message: "Réservation supprimée avec succès" });
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de la réservation :",
          error
        );
        handlePrismaError(error, res);
      }
    },
  ],

  // verifie l'historique des réservations
  // Accessible uniquement aux utilisateurs authentifiés
  getReservationHistory: [
    verifyToken,
    async (req, res) => {
      try {
        const reservations = await prisma.reservation.findMany({
          where: { id_client: req.clientId },
          include: {
            film: {
              select: {
                id_film: true,
                titre: true,
              },
            },
            seance: {
              select: {
                date_projection: true,
                heure_projection: true,
                salle: {
                  select: {
                    nom_salle: true,
                  },
                },
              },
            },
          },
        });

        res.status(200).json(reservations);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'historique des réservations :",
          error
        );
        res.status(500).json({ message: "Erreur interne du serveur" });
      }
    },
  ],
};

export default reservationController;