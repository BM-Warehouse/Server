const prisma = require('@src/libs/prisma');

const checkouts = [
  { userId: 1, totalPrice: 1, status: "<script>alert('hi')</script>" },
  { userId: 2, totalPrice: 2, status: '울란바토르' },
  { userId: 3, totalPrice: 3, status: '👩🏽' },
  { userId: 4, totalPrice: 4, status: '1E02' },
  { userId: 5, totalPrice: 5, status: 'ÅÍÎÏ˝ÓÔÒÚÆ☃' },
  { userId: 6, totalPrice: 6, status: "'" },
  { userId: 7, totalPrice: 7, status: '⁰⁴⁵₀₁₂' },
  { userId: 8, totalPrice: 8, status: "\"'\"'\"''''\"" },
  { userId: 9, totalPrice: 9, status: '-$1.00' },
  { iuserId: 10, totalPrice: 10, status: '¡™£¢∞§¶•ªº–≠' },
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
