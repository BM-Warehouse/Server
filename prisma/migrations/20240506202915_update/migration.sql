/*
  Warnings:

  - The primary key for the `ProductCart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductCart` table. All the data in the column will be lost.
  - The primary key for the `ProductCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductCategory` table. All the data in the column will be lost.
  - The primary key for the `ProductCheckout` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductCheckout` table. All the data in the column will be lost.
  - The primary key for the `ProductWarehouse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductWarehouse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductCart" DROP CONSTRAINT "ProductCart_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ProductCart_pkey" PRIMARY KEY ("productId", "cartId");

-- AlterTable
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("productId", "categoryId");

-- AlterTable
ALTER TABLE "ProductCheckout" DROP CONSTRAINT "ProductCheckout_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ProductCheckout_pkey" PRIMARY KEY ("productId", "checkoutId");

-- AlterTable
ALTER TABLE "ProductWarehouse" DROP CONSTRAINT "ProductWarehouse_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ProductWarehouse_pkey" PRIMARY KEY ("productId", "warehouseId");
