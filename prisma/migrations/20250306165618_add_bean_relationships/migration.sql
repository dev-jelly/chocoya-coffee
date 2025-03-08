-- CreateTable
CREATE TABLE "Bean" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "origin" TEXT,
    "region" TEXT,
    "farm" TEXT,
    "altitude" TEXT,
    "process" TEXT,
    "variety" TEXT,
    "roastLevel" TEXT,
    "roaster" TEXT,
    "roastDate" DATETIME,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Bean_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "brewingMethod" TEXT NOT NULL,
    "difficulty" TEXT,
    "preparationTime" TEXT,
    "beanAmount" TEXT,
    "waterAmount" TEXT,
    "waterTemp" TEXT,
    "grindSize" TEXT,
    "tools" TEXT,
    "acidity" TEXT,
    "sweetness" TEXT,
    "body" TEXT,
    "recommendedBeans" TEXT,
    "beanId" TEXT,
    CONSTRAINT "Recipe_beanId_fkey" FOREIGN KEY ("beanId") REFERENCES "Bean" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Recipe" ("acidity", "beanAmount", "body", "brewingMethod", "createdAt", "description", "difficulty", "grindSize", "id", "isPublic", "preparationTime", "recommendedBeans", "sweetness", "title", "tools", "updatedAt", "userId", "waterAmount", "waterTemp") SELECT "acidity", "beanAmount", "body", "brewingMethod", "createdAt", "description", "difficulty", "grindSize", "id", "isPublic", "preparationTime", "recommendedBeans", "sweetness", "title", "tools", "updatedAt", "userId", "waterAmount", "waterTemp" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
CREATE TABLE "new_TasteNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coffeeName" TEXT NOT NULL,
    "origin" TEXT,
    "roastLevel" TEXT,
    "roaster" TEXT,
    "brewingMethod" TEXT NOT NULL,
    "grindSize" TEXT,
    "beanAmount" TEXT,
    "waterAmount" TEXT,
    "waterTemp" TEXT,
    "brewTime" TEXT,
    "ratio" TEXT,
    "overallRating" INTEGER,
    "acidity" INTEGER,
    "sweetness" INTEGER,
    "body" INTEGER,
    "bitterness" INTEGER,
    "flavorNotes" TEXT,
    "notes" TEXT,
    "flavorLabels" TEXT,
    "flavorColors" TEXT,
    "primaryColor" TEXT,
    "beanId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TasteNote_beanId_fkey" FOREIGN KEY ("beanId") REFERENCES "Bean" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TasteNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TasteNote_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TasteNote" ("acidity", "beanAmount", "bitterness", "body", "brewTime", "brewingMethod", "coffeeName", "createdAt", "date", "flavorColors", "flavorLabels", "flavorNotes", "grindSize", "id", "notes", "origin", "overallRating", "primaryColor", "ratio", "recipeId", "roastLevel", "roaster", "sweetness", "updatedAt", "userId", "waterAmount", "waterTemp") SELECT "acidity", "beanAmount", "bitterness", "body", "brewTime", "brewingMethod", "coffeeName", "createdAt", "date", "flavorColors", "flavorLabels", "flavorNotes", "grindSize", "id", "notes", "origin", "overallRating", "primaryColor", "ratio", "recipeId", "roastLevel", "roaster", "sweetness", "updatedAt", "userId", "waterAmount", "waterTemp" FROM "TasteNote";
DROP TABLE "TasteNote";
ALTER TABLE "new_TasteNote" RENAME TO "TasteNote";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
