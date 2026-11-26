/*
  Warnings:

  - A unique constraint covering the columns `[trainerId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "trainerId" INTEGER;

-- CreateTable
CREATE TABLE "trainers" (
    "id" SERIAL NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "phone" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_trainers" (
    "groupId" INTEGER NOT NULL,
    "trainerId" INTEGER NOT NULL,

    CONSTRAINT "group_trainers_pkey" PRIMARY KEY ("groupId","trainerId")
);

-- CreateIndex
CREATE INDEX "group_trainers_trainerId_idx" ON "group_trainers"("trainerId");

-- CreateIndex
CREATE UNIQUE INDEX "users_trainerId_key" ON "users"("trainerId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_trainers" ADD CONSTRAINT "group_trainers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_trainers" ADD CONSTRAINT "group_trainers_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "trainers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
