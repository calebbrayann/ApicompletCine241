/*
  Warnings:

  - You are about to drop the column `durer` on the `film` table. All the data in the column will be lost.
  - Added the required column `duree` to the `film` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_film" (
    "id_film" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "auteur" TEXT,
    "realisateur" TEXT,
    "duree" INTEGER NOT NULL,
    "genre" TEXT,
    "synopsis" TEXT,
    "bande_annonce" TEXT,
    "affiche" TEXT,
    "date_sortie" DATETIME NOT NULL
);
INSERT INTO "new_film" ("affiche", "auteur", "bande_annonce", "date_sortie", "genre", "id_film", "realisateur", "synopsis", "titre") SELECT "affiche", "auteur", "bande_annonce", "date_sortie", "genre", "id_film", "realisateur", "synopsis", "titre" FROM "film";
DROP TABLE "film";
ALTER TABLE "new_film" RENAME TO "film";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
