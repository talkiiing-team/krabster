-- CreateEnum
CREATE TYPE "ReleaseStatus" AS ENUM ('Official', 'Promotion', 'Bootleg', 'PseudoRelease', 'Withdrawn', 'Cancelled', 'Unknown');

-- CreateEnum
CREATE TYPE "ArtistType" AS ENUM ('Person', 'Group', 'Orchestra', 'Choir', 'Character', 'Other');

-- CreateEnum
CREATE TYPE "MediaFormat" AS ENUM ('MP3', 'MP4', 'WEBM');

-- CreateEnum
CREATE TYPE "MediaSource" AS ENUM ('YouTube');

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortName" TEXT NOT NULL,
    "aliases" TEXT[],
    "type" "ArtistType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "releaseId" TEXT,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Release" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3),
    "coverId" TEXT,
    "status" "ReleaseStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackArtist" (
    "id" SERIAL NOT NULL,
    "joinPhrase" TEXT,
    "artistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "name" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReleaseArtist" (
    "id" SERIAL NOT NULL,
    "joinPhrase" TEXT,
    "name" TEXT,
    "artistId" TEXT NOT NULL,
    "releaseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReleaseArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackRelease" (
    "id" SERIAL NOT NULL,
    "releaseId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackRelease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "durationMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Download" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "format" "MediaFormat" NOT NULL,
    "platform" "MediaSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Download_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Download_trackId_platform_key" ON "Download"("trackId", "platform");

-- AddForeignKey
ALTER TABLE "TrackArtist" ADD CONSTRAINT "TrackArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackArtist" ADD CONSTRAINT "TrackArtist_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseArtist" ADD CONSTRAINT "ReleaseArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseArtist" ADD CONSTRAINT "ReleaseArtist_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackRelease" ADD CONSTRAINT "TrackRelease_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackRelease" ADD CONSTRAINT "TrackRelease_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
