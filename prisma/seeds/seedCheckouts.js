const prisma = require('@src/libs/prisma');

const checkouts = [
  { id: 1, userId: 1, totalPrice: 1, status: "<script>alert('hi')</script>" },
  { id: 2, userId: 2, totalPrice: 2, status: '울란바토르' },
  { id: 3, userId: 3, totalPrice: 3, status: '👩🏽' },
  { id: 4, userId: 4, totalPrice: 4, status: '1E02' },
  { id: 5, userId: 5, totalPrice: 5, status: 'ÅÍÎÏ˝ÓÔÒÚÆ☃' },
  { id: 6, userId: 6, totalPrice: 6, status: "'" },
  { id: 7, userId: 7, totalPrice: 7, status: '⁰⁴⁵₀₁₂' },
  { id: 8, userId: 8, totalPrice: 8, status: "\"'\"'\"''''\"" },
  { id: 9, userId: 9, totalPrice: 9, status: '-$1.00' },
  { id: 10, userId: 10, totalPrice: 10, status: '¡™£¢∞§¶•ªº–≠' },
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
