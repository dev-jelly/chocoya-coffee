-- CreateTable
CREATE TABLE "Grinder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "burr" TEXT,
    "burrSize" TEXT,
    "adjustmentType" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GrinderSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "grinderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "brewingMethod" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GrinderSetting_grinderId_fkey" FOREIGN KEY ("grinderId") REFERENCES "Grinder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "grinderId" TEXT,
    "grinderSetting" TEXT,
    "acidity" TEXT,
    "sweetness" TEXT,
    "body" TEXT,
    "recommendedBeans" TEXT,
    "beanId" TEXT,
    CONSTRAINT "Recipe_grinderId_fkey" FOREIGN KEY ("grinderId") REFERENCES "Grinder" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Recipe_beanId_fkey" FOREIGN KEY ("beanId") REFERENCES "Bean" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Recipe" ("acidity", "beanAmount", "beanId", "body", "brewingMethod", "createdAt", "description", "difficulty", "grindSize", "id", "isPublic", "preparationTime", "recommendedBeans", "sweetness", "title", "tools", "updatedAt", "userId", "waterAmount", "waterTemp") SELECT "acidity", "beanAmount", "beanId", "body", "brewingMethod", "createdAt", "description", "difficulty", "grindSize", "id", "isPublic", "preparationTime", "recommendedBeans", "sweetness", "title", "tools", "updatedAt", "userId", "waterAmount", "waterTemp" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
