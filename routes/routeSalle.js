import express from 'express';
const router = express.Router();
import salleController from '../controllers/controllerSalle.js';
import verifyToken from '../middleware/authMiddleware.js';

// Récupérer toutes les salles
// Accessible uniquement aux utilisateurs authentifiés
router.get('/', verifyToken, salleController.getAllSalles);

// Récupérer une salle par ID
// Accessible uniquement aux utilisateurs authentifiés
router.get('/:id', verifyToken, salleController.getSalleById);

// Créer une salle
// Accessible uniquement aux utilisateurs authentifiés
router.post('/', verifyToken, salleController.createSalle);

// Mettre à jour une salle
// Accessible uniquement aux utilisateurs authentifiés
router.put('/:id', verifyToken, salleController.updateSalle);

// Supprimer une salle
// Accessible uniquement aux utilisateurs authentifiés
router.delete('/:id', verifyToken, salleController.deleteSalle);

export default router;