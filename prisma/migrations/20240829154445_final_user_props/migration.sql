/*
  Warnings:

  - You are about to drop the column `heartDisease` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `noTelp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profile` on the `User` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riwayatDiabetes` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggalLahir` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "User_noTelp_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "heartDisease",
DROP COLUMN "noTelp",
DROP COLUMN "profile",
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "riwayatDiabetes" BOOLEAN NOT NULL,
ADD COLUMN     "riwayatPenyakit" TEXT,
ADD COLUMN     "tanggalLahir" TIMESTAMP(3) NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "Profile";
