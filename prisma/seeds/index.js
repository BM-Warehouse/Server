require('module-alias/register'); // untuk alias path, jadi kita bisa pakai @constants/, @middleware, dst untuk path waktu pakai require 
const seedProducts = require("./seedProduct");
const seedCategories= require("./seedCategories");

async function main(){
    // tambah fungsi seed disini
    await seedProducts();
    await seedCategories();
}

main();