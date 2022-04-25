/*
  Warnings:

  - You are about to drop the column `usersId` on the `Postings` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `Shares` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Postings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postingId" TEXT NOT NULL,
    "contentsId" INTEGER,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "groupsGroupId" TEXT,
    "groupsUsersId" INTEGER,
    CONSTRAINT "Postings_groupsGroupId_groupsUsersId_fkey" FOREIGN KEY ("groupsGroupId", "groupsUsersId") REFERENCES "Groups" ("groupId", "usersId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Postings_contentsId_fkey" FOREIGN KEY ("contentsId") REFERENCES "Contents" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Postings" ("contentsId", "createAt", "id", "postingId", "updateAt") SELECT "contentsId", "createAt", "id", "postingId", "updateAt" FROM "Postings";
DROP TABLE "Postings";
ALTER TABLE "new_Postings" RENAME TO "Postings";
CREATE TABLE "new_Shares" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contentsId" INTEGER,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "groupsGroupId" TEXT,
    "groupsUsersId" INTEGER,
    CONSTRAINT "Shares_groupsGroupId_groupsUsersId_fkey" FOREIGN KEY ("groupsGroupId", "groupsUsersId") REFERENCES "Groups" ("groupId", "usersId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Shares_contentsId_fkey" FOREIGN KEY ("contentsId") REFERENCES "Contents" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Shares" ("contentsId", "createAt", "groupsGroupId", "groupsUsersId", "id", "updateAt") SELECT "contentsId", "createAt", "groupsGroupId", "groupsUsersId", "id", "updateAt" FROM "Shares";
DROP TABLE "Shares";
ALTER TABLE "new_Shares" RENAME TO "Shares";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
