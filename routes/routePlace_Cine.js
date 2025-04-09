import express from 'express';
const router = express.Router();
import place_cineController from '../controllers/controllerPlace_Cine.js';
import verifyToken from '../middleware/authMiddleware.js';

// Récupérer toutes les places de cinéma
// Accessible uniquement aux utilisateurs authentifiés
router.get('/', verifyToken, place_cineController.getAllPlaces_Cine);

// Récupérer une place de cinéma par ID
// Accessible uniquement aux utilisateurs authentifiés
router.get('/:id', verifyToken, place_cineController.getPlace_CineById);

// Créer une nouvelle place de cinéma
// Accessible uniquement aux utilisateurs authentifiés
router.post('/', verifyToken, place_cineController.createPlace_Cine);

// Mettre à jour une place de cinéma
// Accessible uniquement aux utilisateurs authentifiés
router.put('/:id', verifyToken, place_cineController.updatePlace_Cine);

// Supprimer une place de cinéma
// Accessible uniquement aux utilisateurs authentifiés
router.delete('/:id', verifyToken, place_cineController.deletePlace_Cine);

export default router;