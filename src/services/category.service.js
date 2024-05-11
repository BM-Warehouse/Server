const {
  ConflictError,
  InternalServerError,
  ClientError,
  BadRequest,
  NotFoundError,
} = require('@src/exceptions/error.excecptions');
const prisma = require('@src/libs/prisma');

class CategoryService {
  static async getAllCategories({ page, limit, orderType, orderBy, contains }) {
    let where = {};
    let orderInfo;
    const ORDER_TYPE_DEFAULT = 'asc';
    if (contains) {
      where.name = {
        contains,
        mode: 'insensitive',
      };
    }
    if (orderBy === 'id') {
      orderInfo = {
        id: orderType || ORDER_TYPE_DEFAULT,
      };
    } else if (orderBy === 'name') {
      orderInfo = {
        name: orderType || ORDER_TYPE_DEFAULT,
      };
    }
    try {
      const categories = await prisma.category.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: orderInfo,
      });
      return categories;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get all Product from db', e.message);
      } else {
        throw e;
      }
    }
  }

  static async getAllCount() {
    const categoriesCount = await prisma.category.count();
    return categoriesCount;
  }

  static async addCategory(categoryName, categoryDescription, categoryImageUrl) {
    try {
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
        throw new ConflictError('Category is already exist');
      }
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get all Product from db', e.message);
      } else {
        throw e;
      }
    }
  }

  static async editCategory(id, name, description, imageUrl) {
    try {
      if (!id || !name || !description || !imageUrl) {
        throw new BadRequest(
          'Input is invalid',
          'Id, name, description, and image should not be empty!',
        );
      }
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
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get all Product from db', e.message);
      } else {
        throw e;
      }
    }
  }

  static async removeCategory(id) {
    try {
      if (!id) {
        throw new NotFoundError('Category not found', `Category with id ${id} is not available`);
      }
      await prisma.category.delete({
        where: {
          id: +id,
        },
      });
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get all Product from db', e.message);
      } else {
        throw e;
      }
    }
  }

  static async getProductByCategory(categoryId) {
    try {
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
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get all Product from db', e.message);
      } else {
        throw e;
      }
    }
  }

  static async setCategoryforProduct(productId, categoryId) {
    try {
      if (!productId || !categoryId)
        throw new BadRequest(
          'Parameter is not complete',
          'productId and categoryId have to be provided',
        );
      await prisma.productCategory.upsert({
        where: {
          productId_categoryId: {
            productId,
            categoryId,
          },
        },
        update: {},
        create: {
          productId,
          categoryId,
        },
      });
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to delete Product to db', e.message);
      } else {
        throw e;
      }
    }
  }

  static async removeProductCategory(productId, categoryId) {
    try {
      const removed = await prisma.productCategory.delete({
        where: {
          productId_categoryId: {
            productId,
            categoryId,
          },
        },
      });
      return removed;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to delete Product to db', e.message);
      } else {
        throw e;
      }
    }
  }
}

module.exports = CategoryService;
