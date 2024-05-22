const nodemailer = require('nodemailer');
const formatRupiah = require('./formatRupiah');

function formatBathesDataAsTable(data) {
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
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  return tableHTML;
}

// Create email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'warehousebabymom@gmail.com',
    pass: 'oqsp hfqe uatv dqwv',
  },
});

async function sendBatchtoEmailList(batches, mailList) {
  if (batches.length > 0) {
    let html = `<p>There are several product have been expired. 
      You can check on you more about it <a href="#">here</a></p>`;
    html += '<p>Here is some summary</p>';
    html += formatBathesDataAsTable(batches);
    for (const mail of mailList) {
      // Email content
      const mailOptions = {
        from: 'warehousebabymom@gmail.com',
        to: mail,
        subject: 'Batch Data Test',
        html: `<p>${html}</p>`, // Insert the HTML table into the email content
      };
      // Send email
      transporter.sendMail(mailOptions, () => {});
    }
  }
}

function composeOrderInfo(productCheckout) {
  let tableHTML = `
    <table border="1" cellspacing="0" cellpadding="5">
      <thead>
        <tr>
          <th>No</th>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Total Price</th>
          <th>Warehouse Source</th>
        </tr>
      </thead>
      <tbody>
  `;

  productCheckout.forEach((item, i) => {
    tableHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${item.product.name}</td>
        <td>${item.quantityItem}</td>
        <td>${formatRupiah(item.productPrice)}</td>
        <td>${item.warehouse.name}</td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  return tableHTML;
}

async function emailSendOrderInfoToUser(checkout) {
  const mail = checkout.user.email;
  const username = checkout.user.username;
  const resi = checkout.resi;
  let html = `<p>Thank you for your order <b>${username}</b>,<br>`;
  html += `<p>Your order is being delivered with Delibery Number <b>${resi}</b></p>`;
  html += '<p>Here are your detail order</p>';
  html += composeOrderInfo(checkout.productCheckout);
  html += `Total Order Price: <b>${formatRupiah(checkout.totalPrice)}</b>`;

  const mailOptions = {
    from: 'warehousebabymom@gmail.com',
    to: mail,
    subject: `Order Detail #${resi}`,
    html: `<p>${html}</p>`, // Content
  };
  // Send email
  transporter.sendMail(mailOptions, () => {});
}

module.exports = {
  sendBatchtoEmailList,
  emailSendOrderInfoToUser,
};
