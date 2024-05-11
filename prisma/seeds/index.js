require('module-alias/register'); // untuk alias path, jadi kita bisa pakai @constants/, @middleware, dst untuk path waktu pakai require
const prisma = require('@libs/prisma');

const seedProducts = require('./seedProduct');
const seedCategories = require('./seedCategories');
const seedWarehouses = require('./seedWarehouse');
const seedUsers = require('./seedUsers');
const seedCheckouts = require('./seedCheckouts');
const seedBatches = require('./seedBatches');
const seedCarts = require('./seedCarts');
const seedProductCarts = require('./seedProductCarts');
const seedProductCategories = require('./seedProductCategories');
const seedProductCheckout = require('./seedProductCheckout');
const seedProductWarehouses = require('./seedProductWarehouses');

// menyesuaikan product stock dengan yang ada di gudang-gudang
async function updateProductStock() {
  let products = await prisma.product.findMany();

  for (const product of products) {
    let productWarehouses = await prisma.productWarehouse.findMany({
      where: {
        productId: product.id,
      },
    });

    let totalStock = productWarehouses.reduce((sum, item) => sum + item.quantity, 0);

    const a = await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        totalStock,
      },
    });
  }
}

async function main() {
  // tambah fungsi seed disini
  await seedProducts();
  await seedCategories();
  await seedWarehouses();
  await seedUsers();
  await seedCheckouts();
  await seedBatches();
  await seedCarts();
  await seedProductCarts();
  await seedProductCategories();
  await seedProductCheckout();
  await seedProductWarehouses();

  await updateProductStock();
}

main();
