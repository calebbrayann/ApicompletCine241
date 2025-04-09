import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import clientRoutes from "./routes/routeClient.js";
import seanceRoutes from "./routes/routeSeance.js";
import placeCinemaRoutes from "./routes/routePlace_Cine.js";
import salleRoutes from "./routes/routeSalle.js";
import filmRoutes from "./routes/routeFilm.js";
import reservationRoutes from "./routes/routeReservation.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/seances", seanceRoutes);
app.use("/api/places_cinema", placeCinemaRoutes);
app.use("/api/salles", salleRoutes);
app.use("/api/films", filmRoutes);
app.use("/api/reservations", reservationRoutes);

app.get("/", (req, res) => {
  res.send("Bienvenue sur notre serveur cine241!");
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
});