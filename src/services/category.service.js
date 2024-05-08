const { ClientError } = require('@src/exceptions/error.excecptions');
const prisma = require('@src/libs/prisma');

class CategoryService {
  static async getAllCategories() {
    const categories = await prisma.category.findMany();
    return categories;
  }

  static async addCategory(categoryName, categoryDescription, categoryImageUrl) {
    const categoryCheck = await prisma.category.findFirst({
      where: {
        name: categoryName,
      },
    });
    if (!categoryCheck) {
      await prisma.category.create({
        data: {
          name: categoryName,
          description: categoryDescription,
          imageUrl: categoryImageUrl,
        },
      });
    } else {
      throw new ClientError('Category already exist', 'Conflict');
    }
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

  static async getProductByCategory(categoryId) {
    const category = await prisma.category.findMany({
      where: {
        id: categoryId,
      },
      select: {
        name: true,
        productCategories: {
          select: {
            product: true,
          },
        },
      },
    });
    return category;
  }
}

module.exports = CategoryService;
