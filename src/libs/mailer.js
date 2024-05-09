const nodemailer = require('nodemailer');

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

module.exports = {
  sendBatchtoEmailList,
};
