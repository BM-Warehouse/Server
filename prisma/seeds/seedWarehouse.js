const prisma = require('@libs/prisma');

const warehouses = [
    {
        name: 'Warehouse A',
        address: '123 Main Street',
        city: 'New York'
    },
    {
        name: 'Warehouse B',
        address: '456 Elm Street',
        city: 'Los Angeles'
    },
    {
        name: 'Warehouse C',
        address: '789 Oak Street',
        city: 'Chicago'
    },
    {
        name: 'Warehouse D',
        address: '101 Pine Street',
        city: 'Houston'
    },
    {
        name: 'Warehouse E',
        address: '222 Maple Street',
        city: 'Phoenix'
    },
    {
        name: 'Warehouse F',
        address: '333 Cedar Street',
        city: 'Philadelphia'
    },
    {
        name: 'Warehouse G',
        address: '444 Walnut Street',
        city: 'San Antonio'
    },
    {
        name: 'Warehouse H',
        address: '555 Birch Street',
        city: 'San Diego'
    },
    {
        name: 'Warehouse I',
        address: '666 Pineapple Street',
        city: 'Dallas'
    },
    {
        name: 'Warehouse J',
        address: '777 Orange Street',
        city: 'San Jose'
    }
];



async function seedWarehouses() {
    try {
        await prisma.warehouse.createMany({
            data: warehouses
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = seedWarehouses;