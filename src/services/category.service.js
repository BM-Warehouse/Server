const prisma = require('@src/libs/prisma');

class CategoryService {
  static async getAllCategories() {
    const categories = await prisma.category.findMany();
    return categories;
  }

  static async getDetailCategory(id) {
    const category = await prisma.category.findFirst({
      where: {
        id: +id,
      },
    });
    return category;
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
}

module.exports = CategoryService;
