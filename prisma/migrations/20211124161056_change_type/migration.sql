/*
  Warnings:

  - You are about to alter the column `column` on the `Note` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `row` on the `Note` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "noteType" TEXT NOT NULL DEFAULT 'TEXT',
    "content" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "column" INTEGER NOT NULL DEFAULT 0,
    "row" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("color", "column", "content", "createdAt", "id", "name", "noteType", "pinned", "row", "userId") SELECT "color", "column", "content", "createdAt", "id", "name", "noteType", "pinned", "row", "userId" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
