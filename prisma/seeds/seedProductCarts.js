// seed ini harus dijalankan setelah seed produk selesai dilakukan
const prisma = require('@libs/prisma');

const productCarts = [];
// const status = ['not checkouted', 'cheeckouted'];

async function generateProductCarts() {
    let products = await prisma.product.findMany();
    
    for (let i = 1; i <= 10; i++) { //cartId
        shuffleArray(products);
        const numberOfProduct = Math.floor(Math.random() * 10) + 1;
        const selectedProduct = products.slice(0,numberOfProduct);
        
        for(const product of selectedProduct){
            const quantityItem = Math.floor(Math.random() * 10) + 1;
            productCarts.push({
                quantityItem,
                productPrice: product.price * quantityItem,
                productId: product.id,
                cartId: i
            });
        }
    }
    return productCarts;
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
        const productCarts = await generateProductCarts();
        await prisma.productCart.createMany({
            data: productCarts
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = seedProductCarts;