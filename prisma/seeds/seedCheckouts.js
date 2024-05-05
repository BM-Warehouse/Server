const prisma = require('@src/libs/prisma');

const checkouts = [
  { userId: 1, totalPrice: 100000, status: 'Delivered' },
  { userId: 2, totalPrice: 200000, status: 'Packing' },
  { userId: 3, totalPrice: 300000, status: 'Packing' },
  { userId: 4, totalPrice: 400000, status: 'Packing' },
  { userId: 5, totalPrice: 500000, status: 'Delivering' },
  { userId: 6, totalPrice: 600000, status: "Delivering" },
  { userId: 7, totalPrice: 700000, status: 'Packing' },
  { userId: 8, totalPrice: 800000, status: 'Delivered' },
  { userId: 9, totalPrice: 900000, status: 'Packing' },
  { userId: 10, totalPrice: 1000000, status: 'Delivered' },
];

async function seedCheckouts() {
  try {
    await prisma.checkout.createMany({
      data: checkouts,
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = seedCheckouts;
