import express from "express";
const router = express.Router();
import authController from "../controllers/authController.js";

// Créer un nouveau compte utilisateur
router.post("/register", authController.register);

// Se connecter à un compte utilisateur
router.post("/login", authController.login);

// Vérifier un token JWT (optionnel, si nécessaire)
router.get("/verify-token", authController.verifyToken);

// Route pour la déconnexion de l'utilisateur
router.post("/logout", authController.logout); // Utilisez POST pour une action de modification d'état


export default router;