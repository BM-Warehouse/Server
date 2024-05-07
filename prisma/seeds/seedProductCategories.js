// seed ini harus dijalankan setelah seed produk selesai dilakukan
const prisma = require('@libs/prisma');

const productCategories = [];
// const status = ['not checkouted', 'cheeckouted'];

async function generateProductCategories() {
    let products = await prisma.product.findMany();
    let categories = await prisma.category.findMany();

    for (const product of products) { //cartId
        shuffleArray(categories);
        const numberOfSelectedCategories = Math.floor(Math.random() * 3) + 1;
        const selectedCategories = categories.slice(0, numberOfSelectedCategories);

        for (const category of selectedCategories) {
            productCategories.push({
                productId: product.id,
                categoryId: category.id
            });
    }
}
return productCategories;
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
        const productCategories = await generateProductCategories();
        await prisma.productCategory.createMany({
            data: productCategories
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = seedProductCarts;