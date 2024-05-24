const prisma = require('@src/libs/prisma');

const checkouts = [
  {
    userId: 1,
    totalProductPrice: 900000,
    totalPrice: 100000,
    status: 'PACKING',
    method: 'B2B',
    courierId: 1,
    address: 'xxx',
  },
  {
    userId: 2,
    totalProductPrice: 190000,
    totalPrice: 200000,
    status: 'PACKING',
    method: 'ONLINE',
    courierId: 2,
    address: 'xxx',
  },
  {
    userId: 3,
    totalProductPrice: 290000,
    totalPrice: 300000,
    status: 'PACKING',
    method: 'ONLINE',
    courierId: 3,
    address: 'xxx',
  },
  {
    userId: 4,
    totalProductPrice: 390000,
    totalPrice: 400000,
    status: 'PACKING',
    method: 'OFFLINE',
    courierId: 2,
    address: 'xxx',
  },
  {
    userId: 5,
    totalProductPrice: 490000,
    totalPrice: 500000,
    status: 'PACKING',
    method: 'ONLINE',
    courierId: 3,
    address: 'xxx',
  },
  {
    userId: 6,
    totalProductPrice: 590000,
    totalPrice: 600000,
    status: 'PACKING',
    method: 'B2B',
    courierId: 1,
    address: 'xxx',
  },
  {
    userId: 7,
    totalProductPrice: 690000,
    totalPrice: 700000,
    status: 'PACKING',
    method: 'OFFLINE',
    courierId: 3,
    address: 'xxx',
  },
  {
    userId: 8,
    totalProductPrice: 790000,
    totalPrice: 800000,
    status: 'PACKING',
    method: 'ONLINE',
    courierId: 2,
    address: 'xxx',
  },
  {
    userId: 9,
    totalProductPrice: 890000,
    totalPrice: 900000,
    status: 'PACKING',
    method: 'OFFLINE',
    courierId: 3,
    address: 'xxx',
  },
  {
    userId: 10,
    totalProductPrice: 990000,
    totalPrice: 1000000,
    status: 'PACKING',
    method: 'B2B',
    courierId: 1,
    address: 'xxx',
  },
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
