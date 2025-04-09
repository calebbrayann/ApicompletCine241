/*
  Warnings:

  - You are about to drop the `placeCinema` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "placeCinema";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "place_cine" (
    "id_place" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero_place" INTEGER NOT NULL,
    "niveau" TEXT NOT NULL,
    "reserved" BOOLEAN NOT NULL DEFAULT false,
    "id_salle" INTEGER,
    CONSTRAINT "place_cine_id_salle_fkey" FOREIGN KEY ("id_salle") REFERENCES "salle" ("id_salle") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_reservation" (
    "id_reservation" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date_reservation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre_place" INTEGER NOT NULL,
    "paiement" BOOLEAN NOT NULL,
    "id_client" INTEGER,
    "id_place" INTEGER,
    CONSTRAINT "reservation_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client" ("id_client") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reservation_id_place_fkey" FOREIGN KEY ("id_place") REFERENCES "place_cine" ("id_place") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_reservation" ("date_reservation", "id_client", "id_place", "id_reservation", "nombre_place", "paiement") SELECT "date_reservation", "id_client", "id_place", "id_reservation", "nombre_place", "paiement" FROM "reservation";
DROP TABLE "reservation";
ALTER TABLE "new_reservation" RENAME TO "reservation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
