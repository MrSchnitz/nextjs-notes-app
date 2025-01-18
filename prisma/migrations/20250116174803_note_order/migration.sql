-- AlterTable
ALTER TABLE "User" ADD COLUMN "noteOrder" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CheckPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL,
    "noteId" TEXT,
    CONSTRAINT "CheckPoint_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CheckPoint" ("checked", "id", "noteId", "text") SELECT "checked", "id", "noteId", "text" FROM "CheckPoint";
DROP TABLE "CheckPoint";
ALTER TABLE "new_CheckPoint" RENAME TO "CheckPoint";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
