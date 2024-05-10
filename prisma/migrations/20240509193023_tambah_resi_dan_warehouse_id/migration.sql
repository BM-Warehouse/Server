/*
  Warnings:

  - You are about to drop the column `status` on the `Cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "resi" TEXT;

-- AlterTable
ALTER TABLE "ProductCheckout" ADD COLUMN     "warehouseId" INTEGER;

-- AddForeignKey
ALTER TABLE "ProductCheckout" ADD CONSTRAINT "ProductCheckout_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
