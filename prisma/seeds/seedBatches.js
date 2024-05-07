const prisma = require('@libs/prisma');

let batches = [];
let batchId = 1;

for(let j = 1; j <= 10; j++){ //warehouseId
    for(let i = 1; i <= 50; i++){ //productId
        batches.push({
            productId: i,
            warehouseId: j,
            batchName: `batch${batchId}`,
            stock: Math.floor(Math.random() * 1000) + 100,
            expireDate: new Date('2024-01-01')
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
            stock: Math.floor(Math.random() * 1000) + 100,
            expireDate: new Date('2024-02-01')
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