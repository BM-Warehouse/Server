const prisma = require('@src/libs/prisma');

class CategoryService {
  static async getAllCategories() {
    const categories = await prisma.category.findMany();
    return categories;
  }

  static async addCategory(categoryName, categoryDescription, productName, productDescription) {
    await prisma.category.create({
      data: {
        name: categoryName,
        description: categoryDescription,
        imageUrl: `http://www.example.com/product/${Math.floor(Math.random() * 10)}`,
        productCategories: {
          create: {
            product: {
              create: {
                name: productName,
                description: productDescription,
                totalStock: Math.floor(Math.random() * 100) + 1,
                price: Math.floor(100 + Math.random() * 900) * 100,
                imageUrl: `http://www.example.com/product/${Math.floor(Math.random() * 10)}`,
              },
            },
          },
        },
      },
    });
  }

  static async editCategory(id, name, description, imageUrl) {
    await prisma.category.update({
      where: {
        id: +id,
      },
      data: {
        name,
        description,
        imageUrl,
      },
    });
  }

  static async removeCategory(id) {
    await prisma.category.delete({
      where: {
        id: +id,
      },
    });
  }

  static async getIdProduct(categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        productCategories: {
          select: {
            productId: true,
          },
        },
      },
    });
    return category;
  }

  static async getProductByCategory(productId) {
    const products = await prisma.product.findMany({
      where: {
        id: productId,
      },
    });
    return products;
  }
}

module.exports = CategoryService;
