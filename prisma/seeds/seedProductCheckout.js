// seed ini harus dijalankan setelah seed produk selesai dilakukan
const prisma = require('@libs/prisma');

const productCheckouts = [];

async function generateProductCheckouts() {
    let products = await prisma.product.findMany();
    let checkouts = await prisma.checkout.findMany();

    for (const checkout of checkouts) {
        shuffleArray(products);
        const numberOfSelectedProducts = Math.floor(Math.random() * 5) + 1;
        const selectedProduct = products.slice(0, numberOfSelectedProducts);

        for (const product of selectedProduct) {
            const quantityItem = Math.floor(Math.random() * 10 + 1);
            const productPrice = quantityItem * product.price;
            productCheckouts.push({
                productId: product.id,
                checkoutId: checkout.id,
                quantityItem,
                productPrice
            });
        }
    }
    return productCheckouts;
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
        const productCheckouts = await generateProductCheckouts();
        await prisma.productCheckout.createMany({
            data: productCheckouts
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = seedProductCarts;