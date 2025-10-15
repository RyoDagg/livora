-- AlterTable
ALTER TABLE "public"."Listing" ADD COLUMN     "imagesURL" TEXT[] DEFAULT ARRAY[]::TEXT[];
