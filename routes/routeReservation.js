import express from 'express';
const router = express.Router();
import reservationController from '../controllers/controllerReservation.js';
import verifyToken from '../middleware/authMiddleware.js';

// Récupérer toutes les réservations
// Accessible uniquement aux utilisateurs authentifiés
router.get('/', verifyToken, reservationController.getAllReservations);

// Récupérer une réservation par ID
// Accessible uniquement aux utilisateurs authentifiés
router.get('/:id', verifyToken, reservationController.getReservationById);

// Créer une réservation
// Accessible uniquement aux utilisateurs authentifiés
router.post('/', verifyToken, reservationController.createReservation);

// Mettre à jour une réservation
// Accessible uniquement aux utilisateurs authentifiés
router.put('/:id', verifyToken, reservationController.updateReservation);

// Supprimer une réservation
// Accessible uniquement aux utilisateurs authentifiés
router.delete('/:id', verifyToken, reservationController.deleteReservation);

// Récupérer l'historique des réservations
// Accessible uniquement aux utilisateurs authentifiés
router.get("/history", verifyToken, reservationController.getReservationHistory);

export default router;