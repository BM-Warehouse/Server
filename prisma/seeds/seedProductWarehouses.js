// seed ini harus dijalankan setelah seed produk selesai dilakukan
const prisma = require('@libs/prisma');

const productWarehouses = [];

async function generateProductWarehouses() {
    let products = await prisma.product.findMany();
    let warehouses = await prisma.warehouse.findMany();

    for (const warehouse of warehouses) {
        shuffleArray(products);
        const numberOfSelectedProducts = Math.floor(Math.random() * 20) + 5; 
        const selectedProduct = products.slice(0, numberOfSelectedProducts);

        for (const product of selectedProduct) {
            const quantity = Math.floor(Math.random() * 1000 + 100);
            productWarehouses.push({
                productId: product.id,
                warehouseId: warehouse.id,
                quantity
            });
        }
    }
    return productWarehouses;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function seedProductCarts() {
    try {
        const productWarehouses = await generateProductWarehouses();
        await prisma.productWarehouse.createMany({
            data: productWarehouses
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = seedProductCarts;