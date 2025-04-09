/*
  Warnings:

  - You are about to alter the column `durer` on the `film` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to drop the column `reserved` on the `place_cine` table. All the data in the column will be lost.
  - Added the required column `date_sortie` to the `film` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "admin_mot_de_passe_key";

-- DropIndex
DROP INDEX "client_mot_de_passe_key";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_film" (
    "id_film" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "auteur" TEXT,
    "durer" INTEGER NOT NULL,
    "genre" TEXT,
    "synopsis" TEXT,
    "bande_annonce" TEXT,
    "affiche" TEXT,
    "date_sortie" DATETIME NOT NULL
);
INSERT INTO "new_film" ("auteur", "durer", "id_film", "titre") SELECT "auteur", "durer", "id_film", "titre" FROM "film";
DROP TABLE "film";
ALTER TABLE "new_film" RENAME TO "film";
CREATE TABLE "new_place_cine" (
    "id_place" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero_place" INTEGER NOT NULL,
    "niveau" TEXT NOT NULL,
    "id_salle" INTEGER,
    CONSTRAINT "place_cine_id_salle_fkey" FOREIGN KEY ("id_salle") REFERENCES "salle" ("id_salle") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_place_cine" ("id_place", "id_salle", "niveau", "numero_place") SELECT "id_place", "id_salle", "niveau", "numero_place" FROM "place_cine";
DROP TABLE "place_cine";
ALTER TABLE "new_place_cine" RENAME TO "place_cine";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
