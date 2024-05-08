const prisma = require('@src/libs/prisma');

const productsCategories = [
  {
    productId: 1,
    categoryId: 1,
  },
];

async function seedProductsCategories() {
  await prisma.productCategory.createMany({
    data: productsCategories,
  });
}

module.exports = seedProductsCategories;
