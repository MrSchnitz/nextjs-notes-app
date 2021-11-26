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
    "column" TEXT NOT NULL DEFAULT '0',
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("color", "content", "createdAt", "id", "name", "noteType", "pinned", "userId") SELECT "color", "content", "createdAt", "id", "name", "noteType", "pinned", "userId" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
