const prisma = require('@libs/prisma');

let batches = [];
let batchId = 1;

// Function to generate a random date between two specific dates
function getRandomDate(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime);
}

const startDate = '2024-5-1';
const endDate = '2024-8-1';

for(let j = 1; j <= 10; j++){ //warehouseId
    for(let i = 1; i <= 50; i++){ //productId
        batches.push({
            productId: i,
            warehouseId: j,
            batchName: `batch${batchId}`,
            stock: 1000,
            expireDate: getRandomDate(startDate, endDate)
        });
    }
    batchId++;
}

for(let j = 1; j <= 10; j++){ //warehouseId
    for(let i = 1; i <= 50; i++){ //productId
        batches.push({
            productId: i,
            warehouseId: j,
            batchName: `batch${batchId}`,
            stock: 1000,
            expireDate: getRandomDate(startDate, endDate)
        });
    }
    batchId++;
}

async function seedBatches() {
    try{
        await prisma.batch.createMany({
            data: batches
        });
    } catch(e){
        console.log(e);
    }
}

module.exports = seedBatches;