const prisma = require('@libs/prisma');

const carts = [];
const status = ['not checkouted', 'cheeckouted'];

for (let i = 1; i <= 10; i++) {
    carts.push({
        userId: i,
        totalPrice: ((i % 10) * 1000) + 1000,
        status: status[i % 2]
    });
}


async function seedCarts() {
    try {
        await prisma.cart.createMany({
            data: carts
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = seedCarts;