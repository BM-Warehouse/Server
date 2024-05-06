require('module-alias/register'); // untuk alias path, jadi kita bisa pakai @constants/, @middleware, dst untuk path waktu pakai require
const seedProducts = require('./seedProduct');
const seedCategories = require('./seedCategories');
const seedWarehouses = require('./seedWarehouse');
const seedUsers = require('./seedUsers');
const seedCheckouts = require('./seedCheckouts');

async function main() {
  // tambah fungsi seed disini
  await seedProducts();
  await seedCategories();
  await seedWarehouses();
  await seedUsers();
  await seedCheckouts();
  await seedBatches();
}

main();
