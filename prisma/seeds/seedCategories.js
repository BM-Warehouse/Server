const prisma = require('@libs/prisma');

const categories = [
  {
    name: 'Electronics',
    description: 'Explore the latest gadgets and electronics for your everyday needs.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/3/23/3b38658a-23e1-49d8-abb3-1d5974f3b315.jpg',
  },
  {
    name: 'Clothing',
    description: 'Discover fashionable clothing for all occasions and seasons.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/3/23/3b38658a-23e1-49d8-abb3-1d5974f3b315.jpg',
  },
  {
    name: 'Home & Kitchen',
    description: 'Find everything you need to decorate and organize your home.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/3/23/3b38658a-23e1-49d8-abb3-1d5974f3b315.jpg',
  },
  {
    name: 'Sports & Outdoors',
    description: 'Gear up for your favorite outdoor activities with top-notch equipment.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/3/23/3b38658a-23e1-49d8-abb3-1d5974f3b315.jpg',
  },
  {
    name: 'Books',
    description:
      'Dive into a world of knowledge and imagination with our vast collection of books.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/3/23/3b38658a-23e1-49d8-abb3-1d5974f3b315.jpg',
  },
  {
    name: 'Beauty & Personal Care',
    description:
      'Discover beauty products to pamper yourself and enhance your personal care routine.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/3/23/3b38658a-23e1-49d8-abb3-1d5974f3b315.jpg',
  },
  {
    name: 'Toys & Games',
    description: 'Entertain and educate with our selection of toys and games for all ages.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/2/13/8ad49390-b0c1-437a-8734-0b3cee78298c.jpg',
  },
  {
    name: 'Food & Grocery',
    description: 'Shop for fresh groceries and delicious treats to satisfy your cravings.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/2/13/8ad49390-b0c1-437a-8734-0b3cee78298c.jpg',
  },
  {
    name: 'Health & Fitness',
    description:
      'Achieve your health and fitness goals with our range of products and supplements.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/2/13/8ad49390-b0c1-437a-8734-0b3cee78298c.jpg',
  },
  {
    name: 'Automotive',
    description: 'Equip your car with the latest accessories and essentials for a smooth ride.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/2/13/8ad49390-b0c1-437a-8734-0b3cee78298c.jpg',
  },
  {
    name: 'Furniture',
    description: 'Furnish your living spaces with stylish and comfortable furniture pieces.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/2/13/8ad49390-b0c1-437a-8734-0b3cee78298c.jpg',
  },
  {
    name: 'Pets',
    description: 'Find everything you need to care for and spoil your furry friends.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/2/13/8ad49390-b0c1-437a-8734-0b3cee78298c.jpg',
  },
  {
    name: 'Jewelry',
    description: 'Adorn yourself with exquisite jewelry pieces for any occasion.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/2/13/8ad49390-b0c1-437a-8734-0b3cee78298c.jpg',
  },
  {
    name: 'Tools & Home Improvement',
    description: 'Tackle DIY projects and home repairs with our selection of tools and supplies.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/21/b3b2c09f-894e-4aeb-a3fc-dbcf92b4be80.png',
  },
  {
    name: 'Baby',
    description: 'Welcome your little one with essential baby products and gear.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/21/b3b2c09f-894e-4aeb-a3fc-dbcf92b4be80.png',
  },
  {
    name: 'Office Products',
    description: 'Stay organized and efficient with our range of office supplies and equipment.',
    imageUrl:
      'https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/21/b3b2c09f-894e-4aeb-a3fc-dbcf92b4be80.png',
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
