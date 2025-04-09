import express from 'express';
const router = express.Router();
import clientController from '../controllers/controllerClient.js';
import verifyToken from '../middleware/authMiddleware.js'; 

// Récupérer tous les clients
// Accessible uniquement aux utilisateurs authentifiés
router.get('/', verifyToken, clientController.getAllClients);

// Récupérer un client par ID
// Accessible uniquement aux utilisateurs authentifiés
router.get('/:id', verifyToken, clientController.getClientById);

// Mettre à jour un client
// Accessible uniquement aux utilisateurs authentifiés
router.put('/:id', verifyToken, clientController.updateClient);

// Supprimer un client
// Accessible uniquement aux utilisateurs authentifiés
router.delete('/:id', verifyToken, clientController.deleteClient);

export default router;