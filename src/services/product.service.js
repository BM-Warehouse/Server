const prisma = require('@libs/prisma');

class ProductService {
  static async getAllProducts() {
    const products = await prisma.product.findMany();

    return products;
  }
}

module.exports = ProductService;
