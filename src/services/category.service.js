const prisma = require('@src/libs/prisma');

class CategoryService {
  static async getAllCategories() {
    const categories = await prisma.category.findMany();
    return categories;
  }

  static async addCategory(name, description, imageUrl) {
    await prisma.category.create({
      data: {
        name,
        description,
        imageUrl,
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

  static async getProductByCategory() {
    const products = await prisma.product.findMany({
      where: {
        productCategories: {
          some: {
            category: {
              name: 'pendamping asi',
            },
          },
        },
      },
    });
    return products;
  }
}

module.exports = CategoryService;
