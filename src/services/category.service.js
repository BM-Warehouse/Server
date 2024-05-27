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
      const count = await prisma.category.count({
        where,
      });
      return { categories, count };
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get all categories from db', e.message);
      } else {
        throw e;
      }
    }
  }

  static async getCategoryDetail({ id }) {
    try {
      const category = await prisma.category.findUnique({
        where: {
          id: +id,
        },
      });
      return category;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get category from db', e.message);
      } else {
        throw e;
      }
    }
  }

  static async addCategory({ name, description, imageUrl }) {
    try {
      if (!name || !description || !imageUrl) {
        throw new BadRequest(
          'Input is invalid',
          'Name, description, and imageUrl must not be empty!',
        );
      }
      const categoryCheck = await prisma.category.findFirst({
        where: {
          name,
        },
      });
      if (categoryCheck) {
        throw new ConflictError('Category is already exist');
      } else {
        const newCategory = await prisma.category.create({
          data: {
            name,
            description,
            imageUrl,
          },
        });
        return { newCategory };
      }
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to add category to db', e.message);
      } else {
        throw e;
      }
    }
  }

  static async editCategory(id, name, description, imageUrl) {
    try {
      if (!id && !name && !description && !imageUrl) {
        throw new BadRequest(
          'Input is invalid',
          'Id, name, description, and image should not be empty!',
        );
      }
      const editedCategory = await prisma.category.update({
        where: {
          id: +id,
        },
        data: {
          name,
          description,
          imageUrl,
        },
      });
      return { editedCategory };
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to edit category from db', e.message);
      } else {
        throw e;
      }
    }
  }

  static async removeCategory(id) {
    try {
      const removeCategory = await prisma.category.findUnique({
        where: {
          id: +id,
        },
      });
      if (!removeCategory) {
        throw new NotFoundError('Category Not Found', `Category with id ${id} is not available`);
      } else {
        const removed = await prisma.category.delete({
          where: {
            id: +id,
          },
        });
        return { removed };
      }
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to remove category from db', e.message);
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
          description: true,
          imageUrl: true,
          productCategories: {
            select: {
              product: {
                include: {
                  productCategories: {
                    select: {
                      category: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!category[0]) {
        throw new NotFoundError(
          'Products list in this category not found',
          `Category with id ${categoryId} is not available`,
        );
      }
      return category;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError(
          'Fail to get all Product with specific category from db',
          e.message,
        );
      } else {
        throw e;
      }
    }
  }

  static async setCategoryforProduct(productId, categoryId) {
    try {
      if (!productId || !categoryId) {
        throw new BadRequest(
          'Parameter is not complete',
          'productId and categoryId have to be provided',
        );
      }
      const categoryCheck = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      const productCheck = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      if (!categoryCheck || !productCheck) {
        throw new NotFoundError(
          'Not found',
          `Product ${productId} or category ${categoryId} is not available`,
        );
      }
      const pc = await prisma.productCategory.upsert({
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
      return pc;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to set category for product to db', e.message);
      } else {
        throw e;
      }
    }
  }

  static async removeProductCategory({ productId, categoryId }) {
    try {
      if (!productId || !categoryId) {
        throw new BadRequest(
          'Parameter is not complete',
          'productId and categoryId have to be provided',
        );
      }
      const productCategory = await prisma.productCategory.findUnique({
        where: {
          productId_categoryId: {
            productId,
            categoryId,
          },
        },
      });
      if (!productCategory) {
        throw new NotFoundError(
          'Not found',
          `Product with id ${productId} and category with id ${categoryId} have no relation.`,
        );
      }
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
        throw new InternalServerError('Fail to delete category-product relation to db', e.message);
      } else {
        throw e;
      }
    }
  }
}

module.exports = CategoryService;
