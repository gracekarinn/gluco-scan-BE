-- AlterTable
ALTER TABLE "User" ADD COLUMN     "batasGula" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPro" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "kadarGula" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "namaProduct" TEXT NOT NULL,
    "takaran" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
