import express from 'express';
const router = express.Router();
import seanceController from '../controllers/controllerSeance.js';
import verifyToken from '../middleware/authMiddleware.js';

// Récupérer toutes les séances
// Accessible uniquement aux utilisateurs authentifiés
router.get('/', verifyToken, seanceController.getAllSeances);

// Récupérer une séance par ID
// Accessible uniquement aux utilisateurs authentifiés
router.get('/:id', verifyToken, seanceController.getSeanceById);

// Créer une séance
// Accessible uniquement aux utilisateurs authentifiés
router.post('/', verifyToken, seanceController.createSeance);

// Mettre à jour une séance
// Accessible uniquement aux utilisateurs authentifiés
router.put('/:id', verifyToken, seanceController.updateSeance);

// Supprimer une séance
// Accessible uniquement aux utilisateurs authentifiés
router.delete('/:id', verifyToken, seanceController.deleteSeance);

// Récupérer le statut des places pour une séance
// Accessible uniquement aux utilisateurs authentifiés
router.get('/:id/places-status', verifyToken, seanceController.getSeancePlacesStatus);

export default router;