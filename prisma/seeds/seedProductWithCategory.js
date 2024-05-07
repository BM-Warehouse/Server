const prisma = require('@libs/prisma');

async function seedProductWithCategory() {
  try {
    await prisma.product.create({
      data: {
        name: `sgm`,
        description: `susu formula pendamping ASI`,
        totalStock: Math.floor(Math.random() * 100) + 1,
        price: Math.floor(100 + Math.random() * 900) * 100,
        imageUrl: `http://www.example.com/product/1`,
        productCategories: {
          create: {
            category: {
              create: {
                name: 'pendamping asi',
                description: 'susu formula pendamping ASI',
                imageUrl: `http://www.example.com/product/1`,
              },
            },
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = seedProductWithCategory;
