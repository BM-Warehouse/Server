const prisma = require('@libs/prisma');

let products = [];

for (let i = 1; i <= 50; i++) {
  products.push({
    name: `Product ${i}`,
    description: `Description of Product ${i}`,
    totalStock: Math.floor(Math.random() * 100) + 1,
    price: Math.floor(100 + Math.random() * 900) * 100,
    imageUrl: `http://www.example.com/product/${i}`,
  });
}

async function seedProducts() {
  try {
    await prisma.product.createMany({
      data: products,
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = seedProducts;
