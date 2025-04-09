-- CreateTable
CREATE TABLE "client" (
    "id_client" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "e_mail" TEXT,
    "mot_de_passe" TEXT NOT NULL,
    "genre" TEXT
);

-- CreateTable
CREATE TABLE "reservation" (
    "id_reservation" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date_reservation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre_place" INTEGER NOT NULL,
    "paiement" BOOLEAN NOT NULL,
    "id_client" INTEGER,
    "id_place" INTEGER,
    CONSTRAINT "reservation_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client" ("id_client") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reservation_id_place_fkey" FOREIGN KEY ("id_place") REFERENCES "placeCinema" ("id_place") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "placeCinema" (
    "id_place" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero_place" INTEGER NOT NULL,
    "id_salle" INTEGER,
    CONSTRAINT "placeCinema_id_salle_fkey" FOREIGN KEY ("id_salle") REFERENCES "salle" ("id_salle") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "seance" (
    "id_seance" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date_projection" DATETIME NOT NULL,
    "heure_projection" DATETIME NOT NULL,
    "id_salle" INTEGER,
    "id_film" INTEGER,
    CONSTRAINT "seance_id_salle_fkey" FOREIGN KEY ("id_salle") REFERENCES "salle" ("id_salle") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "seance_id_film_fkey" FOREIGN KEY ("id_film") REFERENCES "film" ("id_film") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "salle" (
    "id_salle" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom_salle" TEXT NOT NULL,
    "capacite" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "film" (
    "id_film" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "auteur" TEXT,
    "durer" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "client_e_mail_key" ON "client"("e_mail");

-- CreateIndex
CREATE UNIQUE INDEX "client_mot_de_passe_key" ON "client"("mot_de_passe");
