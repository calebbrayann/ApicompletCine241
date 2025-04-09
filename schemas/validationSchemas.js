import Joi from "joi";

// Schéma pour les clients
export const clientSchema = Joi.object({
  nom: Joi.string().min(2).max(50).required(),
  prenom: Joi.string().min(2).max(50).optional(),
  e_mail: Joi.string().email().required(),
  mot_de_passe: Joi.string().min(6).required(),
  genre: Joi.string().valid("Homme", "Femme", "Autre").optional(),
});

// Schéma pour les films

// Note : Le champ "image_url" est optionnel et peut être une URL valide ou null
// Le champ "bande_annonce" est optionnel et peut être une URL valide ou null
// Le champ "synopsis" est optionnel et peut être une chaîne de caractères
// Le champ "durer" est un nombre entier représentant la durée en minutes
// Le champ "date_sortie" est une date au format ISO
// Le champ "genre" est une chaîne de caractères représentant le genre du film
// Le champ "realisateur" est une chaîne de caractères représentant le nom du réalisateur
// Le champ "auteur" est une chaîne de caractères représentant le nom de l'auteur
// Le champ "titre" est une chaîne de caractères représentant le titre du film

export const filmSchema = Joi.object({
  titre: Joi.string().min(2).max(100).required(),
  auteur: Joi.string().min(2).max(50).optional(),
  durer: Joi.number().integer().min(1).max(500).required(),
  realisateur: Joi.string().min(2).max(50).required(),
  date_sortie: Joi.date().iso().required(),
  genre: Joi.string().min(2).max(50).required(),
  synopsis: Joi.string().min(10).max(1000).optional(),
  image_url: Joi.string().uri().optional(),
  bande_annonce: Joi.string().uri().optional(),
  affiche: Joi.string().uri().optional(), //
});

// Schéma pour les salles
export const salleSchema = Joi.object({
  nom_salle: Joi.string().min(2).max(50).required(),
  capacite: Joi.number().integer().min(1).max(1000).required(),
});

// Schéma pour les séances
export const seanceSchema = Joi.object({
  date_projection: Joi.date().greater("now").required(), // Date dans le futur
  heure_projection: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(), // Format HH:mm
  id_salle: Joi.number().integer().required(),
  id_film: Joi.number().integer().required(),
});

// Schéma pour les réservations
export const reservationSchema = Joi.object({
  date_reservation: Joi.date().greater("now").required(), // Date dans le futur
  nombre_place: Joi.number().integer().min(1).required(),
  paiement: Joi.string().valid("Carte", "Espèces", "Chèque").required(),
  id_client: Joi.number().integer().required(),
  id_place: Joi.number().integer().required(),
});
