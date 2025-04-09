import express from "express";
const router = express.Router();
import filmController from "../controllers/controllerFilm.js";
console.log("filmController:", filmController);
import verifyToken from "../middleware/authMiddleware.js";

// Récupérer tous les films
// Accessible uniquement aux utilisateurs authentifiés
router.get("/", verifyToken, filmController.getAllFilms);

// Récupérer un film par ID
// Accessible uniquement aux utilisateurs authentifiés
router.get("/:id", verifyToken, filmController.getFilmById);

// Créer un nouveau film
// Accessible uniquement aux utilisateurs authentifiés
router.post("/", verifyToken, filmController.createFilm);

// Mettre à jour un film
// Accessible uniquement aux utilisateurs authentifiés
router.put("/:id", verifyToken, filmController.updateFilm);

// Supprimer un film
// Accessible uniquement aux utilisateurs authentifiés
router.delete("/:id", verifyToken, filmController.deleteFilm);

// Recherche et filtres pour les films
// Accessible uniquement aux utilisateurs authentifiés
router.get("/search", verifyToken, filmController.searchFilms);

// Récupérer les films à l'affiche dans un cinéma spécifique (par ID de la salle)
// Accessible uniquement aux utilisateurs authentifiés
router.get("/by-cinema/:id", verifyToken, filmController.getFilmsByCinema);

export default router;