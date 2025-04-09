import prisma from "../lib/prismaClient.js";
import { filmSchema } from "../schemas/validationSchemas.js"; // Import du schéma Joi pour les films
import { validateId } from "../middleware/validateId.js"; // Middleware pour valider les IDs
import { handlePrismaError } from "../utils/errorHandler.js"; // Gestion des erreurs Prisma

const filmController = {
  // Récupérer tous les films
  getAllFilms: async (req, res) => {
    try {
      const films = await prisma.film.findMany();
      if (films.length === 0) {
        return res.status(404).json({ message: "Aucun film trouvé" });
      }
      res.status(200).json({
        message: `${films.length} film(s) trouvé(s)`,
        films,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des films :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  },

  // Récupérer un film par son ID
  getFilmById: [
    validateId,
    async (req, res) => {
      try {
        const { id } = req.params;

        const film = await prisma.film.findUnique({
          where: { id_film: parseInt(id) },
          include: {
            acteurs: true, // Inclure les acteurs associés au film
          },
        });
        if (!film) {
          return res.status(404).json({ message: "Film non trouvé" });
        }
        res.status(200).json(film);
      } catch (error) {
        console.error("Erreur lors de la récupération du film :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
      }
    },
  ],

  // Créer un film
  createFilm: async (req, res) => {
    try {
      // Validation des données avec Joi
      const { error, value } = filmSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const {
        titre,
        auteur,
        durer,
        realisateur,
        date_sortie,
        genre,
        synopsis,
        image_url,
      } = value;

      const newFilm = await prisma.film.create({
        data: {
          titre,
          auteur,
          durer,
          realisateur,
          date_sortie,
          genre,
          synopsis,
          image_url,
        },
      });

      res.status(201).json({
        message: "Film créé avec succès",
        newFilm,
      });
    } catch (error) {
      console.error("Erreur lors de la création du film :", error);
      // handlePrismaError(error, res); // Vous pouvez réactiver ceci si vous préférez la gestion d'erreur centralisée
      res.status(500).json({ message: error.message }); // Affichage direct du message d'erreur
    }
  },

  // Mettre à jour un film
  updateFilm: [
    validateId,
    async (req, res) => {
      try {
        const { id } = req.params;

        // Validation des données avec Joi
        const { error, value } = filmSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }

        // Utilisez 'value' pour extraire les données validées
        const {
          titre,
          auteur,
          durer,
          realisateur,
          date_sortie,
          genre,
          synopsis,
          image_url,
          bande_annonce,
          affiche,
        } = value;

        const updatedFilm = await prisma.film.update({
          where: { id_film: parseInt(id) },
          data: {
            titre,
            auteur,
            durer,
            realisateur,
            date_sortie,
            genre,
            synopsis,
            image_url,
            bande_annonce,
            affiche,
          },
        });

        res.status(200).json({
          message: "Film mis à jour avec succès",
          updatedFilm,
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour du film :", error);
        handlePrismaError(error, res);
      }
    },
  ],

  // Supprimer un film
  deleteFilm: [
    validateId,
    async (req, res) => {
      try {
        const { id } = req.params;

        await prisma.film.delete({
          where: { id_film: parseInt(id) },
        });

        res.status(204).json({ message: "Film supprimé avec succès" });
      } catch (error) {
        console.error("Erreur lors de la suppression du film :", error);
        handlePrismaError(error, res);
      }
    },
  ],

  // Recherche et filtres pour les films
  searchFilms: async (req, res) => {
    try {
      const { titre, genre, acteur, realisateur, date, cinema } = req.query;

      // Construire les filtres dynamiquement
      const filters = {};
      if (titre) filters.titre = { contains: titre, mode: "insensitive" };
      if (genre) filters.genre = { contains: genre, mode: "insensitive" };
      if (realisateur)
        filters.auteur = { contains: realisateur, mode: "insensitive" };
      if (date) filters.date_sortie = { equals: new Date(date) };

      // Recherche par acteur
      const acteurFilter = acteur
        ? {
            acteurs: {
              some: {
                nom: { contains: acteur, mode: "insensitive" },
              },
            },
          }
        : {};

      // Recherche par cinéma (salle)
      const cinemaFilter = cinema
        ? {
            seances: {
              some: {
                salle: {
                  nom_salle: { contains: cinema, mode: "insensitive" },
                },
              },
            },
          }
        : {};

      // Requête Prisma avec les filtres
      const films = await prisma.film.findMany({
        where: {
          ...filters,
          ...acteurFilter,
          ...cinemaFilter,
        },
        include: {
          seances: {
            include: {
              salle: true, // Inclure les informations sur la salle
            },
          },
          acteurs: true, // Inclure les acteurs associés
        },
      });

      // Vérifier si des films ont été trouvés
      if (films.length === 0) {
        return res
          .status(404)
          .json({ message: "Aucun film trouvé avec ces critères" });
      }

      // Retourner les résultats
      res.status(200).json({
        message: `${films.length} film(s) trouvé(s)`,
        films,
      });
    } catch (error) {
      console.error("Erreur lors de la recherche des films :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  },

  // Récupérer les films à l'affiche dans un cinéma spécifique
  getFilmsByCinema: [
    validateId, // Valider l'ID de la salle (considérée comme l'ID du cinéma)
    async (req, res) => {
      try {
        const { id } = req.params; // L'ID de la salle

        const seancesInCinema = await prisma.seance.findMany({
          where: {
            id_salle: parseInt(id),
            date_projection: { gte: new Date() }, // Afficher les séances à venir ou actuelles
          },
          include: {
            film: {
              select: {
                id_film: true,
                titre: true,
                affiche: true, // Assurez-vous que ce champ existe dans votre modèle Film
              },
            },
            heure_projection: true,
            salle: {
              select: {
                nom_salle: true,
              },
            },
          },
        });

        if (seancesInCinema.length === 0) {
          return res
            .status(404)
            .json({ message: "Aucun film à l'affiche trouvé pour ce cinéma." });
        }

        // Organiser les films pour éviter les doublons si un film a plusieurs séances
        const filmsAffiche = {};
        seancesInCinema.forEach((seance) => {
          if (seance.film) {
            if (!filmsAffiche[seance.film.id_film]) {
              filmsAffiche[seance.film.id_film] = {
                id_film: seance.film.id_film,
                titre: seance.film.titre,
                affiche: seance.film.affiche,
                horaires: [],
                nom_salle: seance.salle.nom_salle,
              };
            }
            // Formatter l'heure de projection (si c'est un objet Date)
            const heure =
              seance.heure_projection instanceof Date
                ? `${seance.heure_projection
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${seance.heure_projection
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`
                : seance.heure_projection; // Si c'est déjà une string

            filmsAffiche[seance.film.id_film].horaires.push(heure);
          }
        });

        res.status(200).json({
          message: `${
            Object.keys(filmsAffiche).length
          } film(s) à l'affiche trouvé(s) dans ce cinéma.`,
          films: Object.values(filmsAffiche),
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des films par cinéma :",
          error
        );
        handlePrismaError(error, res);
      }
    },
  ],
};

export default filmController;
