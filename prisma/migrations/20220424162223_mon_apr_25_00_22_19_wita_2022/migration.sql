-- CreateTable
CREATE TABLE "Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Groups" (
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "usersId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("groupId", "usersId"),
    CONSTRAINT "Groups_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cookies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT,
    "value" TEXT NOT NULL,
    "usersId" INTEGER,
    CONSTRAINT "Cookies_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "price" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "contentsId" INTEGER NOT NULL,
    CONSTRAINT "Images_contentsId_fkey" FOREIGN KEY ("contentsId") REFERENCES "Contents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Postings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postingId" TEXT NOT NULL,
    "usersId" INTEGER,
    "contentsId" INTEGER,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    CONSTRAINT "Postings_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Postings_contentsId_fkey" FOREIGN KEY ("contentsId") REFERENCES "Contents" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Shares" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usersId" INTEGER,
    "contentsId" INTEGER,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "groupsGroupId" TEXT,
    "groupsUsersId" INTEGER,
    CONSTRAINT "Shares_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Shares_groupsGroupId_groupsUsersId_fkey" FOREIGN KEY ("groupsGroupId", "groupsUsersId") REFERENCES "Groups" ("groupId", "usersId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Shares_contentsId_fkey" FOREIGN KEY ("contentsId") REFERENCES "Contents" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Cookies_usersId_key" ON "Cookies"("usersId");
