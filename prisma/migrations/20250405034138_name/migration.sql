/*
  Warnings:

  - Added the required column `prix` to the `seance` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_seance" (
    "id_seance" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date_projection" DATETIME NOT NULL,
    "heure_projection" DATETIME NOT NULL,
    "id_salle" INTEGER,
    "prix" REAL NOT NULL,
    "id_film" INTEGER,
    CONSTRAINT "seance_id_salle_fkey" FOREIGN KEY ("id_salle") REFERENCES "salle" ("id_salle") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "seance_id_film_fkey" FOREIGN KEY ("id_film") REFERENCES "film" ("id_film") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_seance" ("date_projection", "heure_projection", "id_film", "id_salle", "id_seance") SELECT "date_projection", "heure_projection", "id_film", "id_salle", "id_seance" FROM "seance";
DROP TABLE "seance";
ALTER TABLE "new_seance" RENAME TO "seance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
