const prisma = require('@src/libs/prisma');

const couriers = [
  { name: "JNE", price: 10000 },
  { name: "TIKI", price: 12000 },
  { name: "POS INDONESIA", price: 13000 },
  { name: "J&T", price: 14000 },

];

async function seedCouriers() {
  try {
    await prisma.courier.createMany({
      data: couriers,
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = seedCouriers;
