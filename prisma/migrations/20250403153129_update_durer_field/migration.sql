/*
  Warnings:

  - Made the column `durer` on table `film` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "admin" (
    "id_admin" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "e_mail" TEXT,
    "mot_de_passe" TEXT NOT NULL,
    "genre" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_film" (
    "id_film" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "auteur" TEXT,
    "durer" TEXT NOT NULL
);
INSERT INTO "new_film" ("auteur", "durer", "id_film", "titre") SELECT "auteur", "durer", "id_film", "titre" FROM "film";
DROP TABLE "film";
ALTER TABLE "new_film" RENAME TO "film";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "admin_e_mail_key" ON "admin"("e_mail");

-- CreateIndex
CREATE UNIQUE INDEX "admin_mot_de_passe_key" ON "admin"("mot_de_passe");
