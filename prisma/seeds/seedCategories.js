const prisma = require('@libs/prisma');

const categories = [
    {
        name: 'Electronics',
        description: 'Explore the latest gadgets and electronics for your everyday needs.',
        imageUrl: 'https://example.com/electronics.jpg'
    },
    {
        name: 'Clothing',
        description: 'Discover fashionable clothing for all occasions and seasons.',
        imageUrl: 'https://example.com/clothing.jpg'
    },
    {
        name: 'Home & Kitchen',
        description: 'Find everything you need to decorate and organize your home.',
        imageUrl: 'https://example.com/home_kitchen.jpg'
    },
    {
        name: 'Sports & Outdoors',
        description: 'Gear up for your favorite outdoor activities with top-notch equipment.',
        imageUrl: 'https://example.com/sports_outdoors.jpg'
    },
    {
        name: 'Books',
        description: 'Dive into a world of knowledge and imagination with our vast collection of books.',
        imageUrl: 'https://example.com/books.jpg'
    },
    {
        name: 'Beauty & Personal Care',
        description: 'Discover beauty products to pamper yourself and enhance your personal care routine.',
        imageUrl: 'https://example.com/beauty_personal_care.jpg'
    },
    {
        name: 'Toys & Games',
        description: 'Entertain and educate with our selection of toys and games for all ages.',
        imageUrl: 'https://example.com/toys_games.jpg'
    },
    {
        name: 'Food & Grocery',
        description: 'Shop for fresh groceries and delicious treats to satisfy your cravings.',
        imageUrl: 'https://example.com/food_grocery.jpg'
    },
    {
        name: 'Health & Fitness',
        description: 'Achieve your health and fitness goals with our range of products and supplements.',
        imageUrl: 'https://example.com/health_fitness.jpg'
    },
    {
        name: 'Automotive',
        description: 'Equip your car with the latest accessories and essentials for a smooth ride.',
        imageUrl: 'https://example.com/automotive.jpg'
    },
    {
        name: 'Furniture',
        description: 'Furnish your living spaces with stylish and comfortable furniture pieces.',
        imageUrl: 'https://example.com/furniture.jpg'
    },
    {
        name: 'Pets',
        description: 'Find everything you need to care for and spoil your furry friends.',
        imageUrl: 'https://example.com/pets.jpg'
    },
    {
        name: 'Jewelry',
        description: 'Adorn yourself with exquisite jewelry pieces for any occasion.',
        imageUrl: 'https://example.com/jewelry.jpg'
    },
    {
        name: 'Tools & Home Improvement',
        description: 'Tackle DIY projects and home repairs with our selection of tools and supplies.',
        imageUrl: 'https://example.com/tools_home_improvement.jpg'
    },
    {
        name: 'Baby',
        description: 'Welcome your little one with essential baby products and gear.',
        imageUrl: 'https://example.com/baby.jpg'
    },
    {
        name: 'Office Products',
        description: 'Stay organized and efficient with our range of office supplies and equipment.',
        imageUrl: 'https://example.com/office_products.jpg'
    }
];

async function seedCategories() {
    try{
        await prisma.category.createMany({
            data: categories
        });
    } catch(e){
        console.log(e);
    }
}

module.exports = seedCategories;