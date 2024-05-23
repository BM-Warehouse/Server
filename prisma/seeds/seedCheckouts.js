const prisma = require('@src/libs/prisma');

const checkouts = [
  { userId: 1, totalPrice: 100000, status: 'PACKING', method: "B2B", courierId: 1, address: "xxx" },
  { userId: 2, totalPrice: 200000, status: 'PACKING', method: "ONLINE", courierId: 2, address: "xxx" },
  { userId: 3, totalPrice: 300000, status: 'PACKING', method: "ONLINE", courierId: 3, address: "xxx" },
  { userId: 4, totalPrice: 400000, status: 'PACKING', method: "OFFLINE", courierId: 2, address: "xxx" },
  { userId: 5, totalPrice: 500000, status: 'PACKING', method: "ONLINE", courierId: 3, address: "xxx" },
  { userId: 6, totalPrice: 600000, status: 'PACKING', method: "B2B", courierId: 1, address: "xxx" },
  { userId: 7, totalPrice: 700000, status: 'PACKING', method: "OFFLINE", courierId: 3, address: "xxx" },
  { userId: 8, totalPrice: 800000, status: 'PACKING', method: "ONLINE", courierId: 2, address: "xxx" },
  { userId: 9, totalPrice: 900000, status: 'PACKING', method: "OFFLINE", courierId: 3, address: "xxx" },
  { userId: 10, totalPrice: 1000000, status: 'PACKING', method: "B2B", courierId: 1, address: "xxx" },
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
