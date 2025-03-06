-- AlterTable
ALTER TABLE "TasteNote" ADD COLUMN "flavorColors" TEXT;
ALTER TABLE "TasteNote" ADD COLUMN "flavorLabels" TEXT;
ALTER TABLE "TasteNote" ADD COLUMN "primaryColor" TEXT;

-- CreateTable
CREATE TABLE "TasteNoteLabel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_TasteNoteToTasteNoteLabel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TasteNoteToTasteNoteLabel_A_fkey" FOREIGN KEY ("A") REFERENCES "TasteNote" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TasteNoteToTasteNoteLabel_B_fkey" FOREIGN KEY ("B") REFERENCES "TasteNoteLabel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TasteNoteLabel_name_key" ON "TasteNoteLabel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_TasteNoteToTasteNoteLabel_AB_unique" ON "_TasteNoteToTasteNoteLabel"("A", "B");

-- CreateIndex
CREATE INDEX "_TasteNoteToTasteNoteLabel_B_index" ON "_TasteNoteToTasteNoteLabel"("B");
