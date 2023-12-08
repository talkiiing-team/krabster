/*
  Warnings:

  - The primary key for the `ReleaseArtist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ReleaseArtist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TrackArtist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TrackArtist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TrackRelease` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TrackRelease` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ReleaseArtist" DROP CONSTRAINT "ReleaseArtist_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ReleaseArtist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TrackArtist" DROP CONSTRAINT "TrackArtist_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "TrackArtist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TrackRelease" DROP CONSTRAINT "TrackRelease_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "TrackRelease_pkey" PRIMARY KEY ("id");
