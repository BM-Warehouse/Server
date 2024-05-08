const cron = require('node-cron');
const prisma = require('./prisma');

function formatDataAsTable(data) {
  let tableHTML = `
    <table border="1" cellspacing="0" cellpadding="5">
      <thead>
        <tr>
          <th>ID</th>
          <th>Product ID</th>
          <th>Warehouse ID</th>
          <th>Batch Name</th>
          <th>Stock</th>
          <th>Expire Date</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach((item) => {
    tableHTML += `
      <tr>
        <td>${item.id}</td>
        <td>${item.productId}</td>
        <td>${item.warehouseId}</td>
        <td>${item.batchName}</td>
        <td>${item.stock}</td>
        <td>${item.expireDate}</td>
        <td>${item.createdAt}</td>
        <td>${item.updatedAt}</td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  return tableHTML;
}

async function getExpiredProduct(filter = null) {
  let where = {
    expireDate: {
      lt: new Date(),
    },
  };

  let param = {};

  if (filter?.warehouseId) where.warehouseId = +filter.warehouseId;
  if (filter?.page && filter?.limit) {
    (param.skip = (filter.page - 1) * filter.limit), (param.take = filter.limit);
  }

  param = {
    where,
    ...param,
  };

  const batches = await prisma.batch.findMany(param);

  return batches;
}

function runExpiredCheckScheduler() {
  cron.schedule('* * * * *', async () => {});
}

module.exports = {
  runExpiredCheckScheduler,
  getExpiredProduct,
  formatDataAsTable,
};
