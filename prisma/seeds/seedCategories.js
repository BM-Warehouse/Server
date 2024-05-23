const prisma = require('@libs/prisma');

const categories = [
  {
    name: 'Diapers',
    description: 'High-quality diapers to keep your baby comfortable and dry.',
    imageUrl: 'https://res.cloudinary.com/denyah3ls/image/upload/v1716379427/diapers_h9tsmc.jpg',
  },
  {
    name: 'Baby Wipes',
    description: 'Soft and gentle baby wipes for easy cleaning.',
    imageUrl: 'https://res.cloudinary.com/denyah3ls/image/upload/v1716379426/baby-wipes_w0ngnt.jpg',
  },
  {
    name: 'Baby Bottles',
    description: 'BPA-free bottles for safe feeding.',
    imageUrl:
      'https://res.cloudinary.com/denyah3ls/image/upload/v1716379424/baby-bottles_cr47gj.jpg',
  },
  {
    name: 'Breast Pumps',
    description: 'Efficient breast pumps for breastfeeding mothers.',
    imageUrl:
      'https://res.cloudinary.com/denyah3ls/image/upload/v1716379425/breast_pumps_xo0ei1.jpg',
  },
  {
    name: 'Baby Formula',
    description: "Nutritional formula for your baby's growth.",
    imageUrl:
      'https://res.cloudinary.com/denyah3ls/image/upload/v1716379424/baby_formula_cdambg.webp',
  },
  {
    name: 'Pacifiers',
    description: 'Comforting pacifiers for soothing your baby.',
    imageUrl: 'https://res.cloudinary.com/denyah3ls/image/upload/v1716379427/pacifiers_sl0gdm.jpg',
  },
  {
    name: 'Baby Clothes',
    description: 'Soft and cute clothes for your baby.',
    imageUrl:
      'https://res.cloudinary.com/denyah3ls/image/upload/v1716379429/baby_clor_thes_stz8kw.webp',
  },
  {
    name: 'Baby Blankets',
    description: 'Warm and cozy blankets for your baby.',
    imageUrl:
      'https://res.cloudinary.com/denyah3ls/image/upload/v1716379427/baby_blankets_utohu4.jpg',
  },
  {
    name: 'Baby Carriers',
    description: 'Comfortable baby carriers for easy transport.',
    imageUrl:
      'https://res.cloudinary.com/denyah3ls/image/upload/v1716379424/baby_carriers_jsocoh.jpg',
  },
  {
    name: 'Strollers',
    description: 'Convenient strollers for on-the-go parents.',
    imageUrl: 'https://res.cloudinary.com/denyah3ls/image/upload/v1716379428/strollers_z7nti1.webp',
  },
];

async function seedCategories() {
  try {
    await prisma.category.createMany({
      data: categories,
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = seedCategories;
