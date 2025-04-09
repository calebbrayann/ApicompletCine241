-- CreateTable
CREATE TABLE "acteur" (
    "id_acteur" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_acteurTofilm" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_acteurTofilm_A_fkey" FOREIGN KEY ("A") REFERENCES "acteur" ("id_acteur") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_acteurTofilm_B_fkey" FOREIGN KEY ("B") REFERENCES "film" ("id_film") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_acteurTofilm_AB_unique" ON "_acteurTofilm"("A", "B");

-- CreateIndex
CREATE INDEX "_acteurTofilm_B_index" ON "_acteurTofilm"("B");
