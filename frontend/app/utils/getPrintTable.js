export const getPrintableHTML = (data) => {
    const products = data.products || [];
  
    const maxDetails = 20; // Always 20 rows to match the format
  
    const columnTotals = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      products[i]?.details?.forEach(detail => {
        columnTotals[i] += Number(detail.quantity || 0);
      });
    }
  
    const getPrice = (i) => parseFloat(data[`price${i + 1}`] || 0);
    const prices = [getPrice(0), getPrice(1), getPrice(2)];
  
    return `
      <html>
        <head>
          <title>Packing Detail</title>
          <style>
            @page {
              size: A4;
              margin: 0.5cm;
            }
            body {
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
            }
            .container {
              width: 750px;
              border: 2px solid black;
              page-break-inside: avoid;
              transform: scale(0.95);
              transform-origin: top center;
            }
            .header {
              background-color: yellow;
              text-align: center;
              font-weight: bold;
              padding: 10px;
              font-size: 18px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            td, th {
              border: 1px solid black;
              padding: 5px;
              text-align: center;
            }
            .bold {
              font-weight: bold;
            }
            .yellow-bg {
              background-color: yellow;
            }
            .blank-box {
              height: 30px;
              border: 1px solid black;
              text-align: center;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">PACKING DETAIL &nbsp;&nbsp;&nbsp; PH: ${data.mobile || ""}</div>
            <table class="info-table">
              <tr><td class="bold">PARTY NAME</td><td>${data.name?.name || ""}</td><td class="bold">DATE</td><td>${data.date || ""}</td></tr>
              <tr><td class="bold">ADDRESS</td><td>${data.address || ""}</td><td class="bold">CHALLAN NO</td><td>${data.challanNumber || ""}</td></tr>
              <tr><td class="bold">MOB NO</td><td>${data.mobile || ""}</td><td class="bold">DRIVER NAME</td><td>${data.driverName || ""}</td></tr>
            </table>
  
            <table class="data-table">
              <tr>
                <td class="blank-box"></td>
                <td colspan="2" class="blank-box">Product A</td>
                <td colspan="2" class="blank-box">Product B</td>
                <td colspan="2" class="blank-box">Product C</td>
              </tr>
              <tr class="yellow-bg">
                <th>S.NO</th><th>QTY</th><th>SHADE NO</th><th>QTY</th><th>SHADE NO</th><th>QTY</th><th>SHADE NO</th>
              </tr>
              ${Array.from({ length: maxDetails }).map((_, i) => {
                const cells = [0, 1, 2].map(col => {
                  const detail = products[col]?.details?.[i] || { quantity: '', shadeNumber: '' };
                  return `<td>${detail.quantity || ""}</td><td>${detail.shadeNumber || ""}</td>`;
                }).join("");
                return `<tr><td>${i + 1}</td>${cells}</tr>`;
              }).join("")}
  
              <tr class="yellow-bg">
                <td class="bold">T.QTY</td>
                ${columnTotals.map(total => `<td colspan="2" class="bold">${total.toFixed(2)}</td>`).join("")}
              </tr>
              <tr>
                <td class="bold">Price</td>
                ${prices.map(price => `<td colspan="2" class="bold">₹ ${price.toFixed(2)}</td>`).join("")}
              </tr>
              <tr class="yellow-bg">
                <td class="bold">TOTAL PRICE</td>
                ${columnTotals.map((qty, i) => {
                  const total = Math.round(qty * prices[i]);
                  return `<td colspan="2" class="bold">₹ ${total}</td>`;
                }).join("")}
              </tr>
            </table>
  
            <table class="info-table">
              <tr><td class="bold" colspan="3">BASIC AMOUNT</td><td>₹ ${data.basicAmount || ""}</td><td class="bold">TOTAL QTY ROLL</td><td>${parseFloat(data.totalRollQty || 0).toFixed(2)}</td></tr>
              <tr><td class="bold" colspan="3">TCS / FARE</td><td>₹${data.tCSOrFARE || 0}</td><td class="bold">TOTAL WEIGHT</td><td>${data.totalWeight || ""}</td></tr>
              <tr><td class="bold">INVOICE NO</td><td>${data.invoiceNumber || ""}</td><td class="bold">GST</td><td>${data.GSTNumber || ""}</td><td class="bold">TOTAL BAGS</td><td>${data.totalBags || ""}</td></tr>
              <tr class="yellow-bg"><td class="bold" colspan="3">TOTAL AMOUNT</td><td>₹ ${data.totalAmount || ""}</td><td class="bold">RECEIVER NAME</td><td>${data.reciverName || ""}</td></tr>
            </table>
          </div>
        </body>
      </html>
    `;
  };