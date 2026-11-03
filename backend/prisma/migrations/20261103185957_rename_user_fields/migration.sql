/*
  Warnings:

  - You are about to drop the column `CreatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `IsActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `paswordHash` on the `users` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users"
RENAME COLUMN "paswordHash" TO "passwordHash";
ALTER TABLE "users"
RENAME COLUMN "IsActive" TO "isActive";
ALTER TABLE "users"
RENAME COLUMN "CreatedAt" TO "createdAt";
