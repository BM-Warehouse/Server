// seed ini harus dijalankan setelah seed produk dan batch selesai dilakukan
const prisma = require('@libs/prisma');

const productWarehouses = [];

async function generateProductWarehouses() {
    let products = await prisma.product.findMany();
    let warehouses = await prisma.warehouse.findMany();

    for (const warehouse of warehouses) {
        for(const product of products){
            const batches = await prisma.batch.findMany({
                where: {
                    warehouseId: warehouse.id,
                    productId: product.id
                },
                select: {
                    id: true,
                    productId: true,
                    warehouseId: true,
                    stock: true
                }
            })

            let quantity = 0;
            for (const batch of batches) {
                quantity += batch.stock;
            }

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