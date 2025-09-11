/*
  Warnings:

  - You are about to drop the column `available` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `forSale` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `availableAt` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Listing" DROP COLUMN "available",
DROP COLUMN "forSale",
ADD COLUMN     "availableAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "contact" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
