const prisma = require('@libs/prisma');

const carts = [];

for (let i = 1; i <= 10; i++) {
    carts.push({
        userId: i,
        totalPrice: 0,
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