"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../../util/axiosInstance";
import toast from "react-hot-toast";
// import ChallanForm from "../component/header/ChallanForm";
import { FaWhatsapp } from "react-icons/fa";

function ViewChallan() {
  const [challans, setChallans] = useState([]);
  const router = useRouter();

  const fetchChallan = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/challan/get-all-challan"
      );

      setChallans(response.data.challans);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };


  const handleDelete = (id) => {
    toast((t) => (
      <div className="space-y-2">
        <p>Are you sure you want to delete this Challan?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id); 
              try {
                const response = await axiosInstance.delete(
                  `/api/v1/challan/delete-challan/${id}`
                );
                if (response.status === 200) {
                  toast.success("Challan deleted successfully!");
                  fetchChallan(); // refresh list
                }
              } catch (error) {
                console.log("delete error", error);
                if (error.response) {
                  toast.error(error.response.data.message);
                } else {
                  toast.error("Something went wrong!");
                }
              }
            }}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 10000, // auto-dismiss after 10s
    });
  };
  const generateChallanHTML = (data) => {
    // Find the max number of details any product has

    const maxDetails = Math.max(...data.products?.map((p) => p.details.length));

    let columnTotals = new Array(data.products.length).fill(0);

    data.products.forEach((product, productIndex) => {
      product.details.forEach((detail) => {
        columnTotals[productIndex] += detail.quantity || 0;
      });
    });

    const productRows = data.products
      .map(
        (product) => `
        <td colspan="2" class="blank-box">${product.productName}</td>
      `
      )
      .join("");

    const remainingTHs = 3 - data.products.length;

    const extraTHs =
      remainingTHs > 0
        ? Array(remainingTHs)
            .fill('<th colspan="2" class="blank-box"></th>')
            .join("")
        : "";

    const finalProcutCol = productRows + extraTHs;

    return `
    <html>
    <head>
        <title>Packing Detail</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                padding: 20px 10px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                border-collapse: collapse;
            }
            .container {
                width: 750px;
                margin: auto;
                border: 2px solid black;
            }
            .header {
                background-color: yellow;
                text-align: center;
                font-weight: bold;
                padding: 10px;
                font-size: 18px;
            }
            .info-table, .data-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            .info-table td, .data-table td, .data-table th {
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
            /* Product Header Table */
            .product-table {
                width: 100%;
                margin-top: 10px;
                border-collapse: collapse;
            }
            .product-table th {
                border: 1px solid black;
                padding: 8px;
                text-align: center;
                font-weight: bold;
                background-color: lightgray;
            }
            /* Divider Line */
            .divider {
                width: 100%;
                height: 2px;
                background-color: black;
                margin: 10px 0;
            }
            /* Blank Box Styling */
            .blank-box {
                height: 30px;
                border: 1px solid black;
                text-align: center;
                font-weight: bold;
            }


            <style>
    .data-table th:nth-child(1), /* S.NO */
    .data-table td:nth-child(1) {
        width: 5%; /* Reduce width */
    }
    
    .data-table th:nth-child(2), /* QTY */
    .data-table td:nth-child(2),
    .data-table th:nth-child(4), 
    .data-table td:nth-child(4),
    .data-table th:nth-child(6), 
    .data-table td:nth-child(6) {
        width: 15%; /* Increase width */
    }
    
    .data-table th:nth-child(3), /* SHADE NO */
.data-table td:nth-child(3),
.data-table th:nth-child(5),
.data-table td:nth-child(5),
.data-table th:nth-child(7),
.data-table td:nth-child(7) {
    width: 20%; /* Ensuring equal width */
}

    
</style>

        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                PACKING DETAIL &nbsp;&nbsp;&nbsp; PH: ${data.mobile}
            </div>
            
            <table class="info-table">
                <tr>
                    <td class="bold">PARTY NAME</td>
                    <td>${data.name.name}</td>
                    <td class="bold">DATE</td>
                    <td>${data.date}</td>
                </tr>
                <tr>
                    <td class="bold">ADDRESS</td>
                    <td>${data.address}</td>
                    <td class="bold">CHALLAN NO</td>
                    <td>${data.challanNumber}</td>
                </tr>
                <tr>
                    <td class="bold">MOB NO</td>
                    <td>${data.mobile}</td>
                    <td class="bold">DRIVER NAME</td>
                    <td>${data.driverName}</td>
                </tr>
            </table>

            <table class="data-table">
                <!-- Blank Three Vertical Line Box -->
                <tr>
                    <td colspan="0" class="blank-box"></td>
                    ${finalProcutCol}
                   
                </tr>

                <tr class="yellow-bg">
                <th>S.NO</th>
               
                    <th>QTY</th>
                    <th>SHADE NO</th>
                    <th>QTY</th>
                    <th>SHADE NO</th>
                    <th>QTY</th>
                    <th>SHADE NO</th>
            </tr>

               ${Array.from({ length: maxDetails > 10 ? maxDetails : 20 })
                 .map(
                   (_, detailIndex) => `
                <tr>
                    <td>${detailIndex + 1}</td>
                   ${Array(3)
                     .fill("")
                     .map((_, index) => {
                       const product = data.products[index];
                       const detail = product?.details[detailIndex] || {
                         quantity: "",
                         shadeNumber: "",
                       };

                       return `
        <td>${detail.quantity}</td>
        <td>${detail.shadeNumber}</td>
    `;
                     })
                     .join("")}

                </tr>
            `
                 )
                 .join("")}
                 <tr class="yellow-bg">
                <td class="bold">T.QTY</td>
                ${Array(3)
                  .fill("")
                  .map((_, index) => {
                    const total = columnTotals?.[index];
                    return `<td colspan="2" class="bold">${
                      total != null && total !== ""
                        ? parseFloat(total).toFixed(2)
                        : ""
                    }</td>`;
                  })
                  .join("")}
         
            </tr>
                 <tr>
    <td class="bold">Price</td>
    ${Array(3)
      .fill("")
      .map((_, index) => {
        const price = data[`price${index + 1}`]; 
        return `<td colspan="2" class="bold">${
          price !== undefined && price !== null
            ? `₹ ${parseFloat(price).toFixed(2)}`
            : ""
        }</td>`;
      })
      .join("")}
</tr>

                  <tr class="yellow-bg">  
                <td class="bold">TOTAL PRICE</td>
                ${Array(3)
                  .fill("")
                  .map((_, index) => {
                    const price = data[`price${index + 1}`] || 0;
                    const totalPrice = (columnTotals[index] || 0) * price;
                    return totalPrice
                      ? `<td colspan="2" class="bold">₹ ${Math.round(
                          totalPrice
                        )}</td>`
                      : `<td colspan="2" class="bold"></td>`;
                  })
                  .join("")}
                
            </tr>
            </table>

            <table class="info-table">
                <tr>
                    <td class="bold" colspan="3">BASIC AMOUNT</td>
                    <td>₹ ${data.basicAmount || ""}</td>
                    <td class="bold">TOTAL QTY ROLL</td>
                    <td>${parseFloat(data.totalRollQty).toFixed(2)}</td>
                </tr>
                <tr>
                    <td class="bold" colspan="3">TCS / FARE</td>
                    <td >₹${data.tCSOrFARE || ""}</td>
                    <td class="bold">TOTAL WEIGHT</td>
                    <td>${data.totalWeight || ""}</td>
                </tr>
                <tr>
                    <td class="bold">INVOICE NO</td>
                    <td>${data.invoiceNumber || ""}</td>
                    <td class="bold">GST</td>
                    <td>${data.GSTNumber || ""}</td>
                    <td class="bold">TOTAL BAGS</td>
                    <td>${data.totalBags || ""}</td>
                </tr>
                <tr class="yellow-bg">
                    <td class="bold" colspan="3">TOTAL AMOUNT</td>
                    <td>₹ ${data.totalAmount || ""}</td>
                    <td class="bold" >RECEIVER NAME</td>
                    <td ></td>
                </tr>
            </table>
        </div>
    </body>
</html>

    `;
  };

  const handleDownload = async (id) => {
    if (challans && challans.length > 0) {
      const challan = challans.find((challan) => {
        if (challan._id === id) {
          return challan;
        }
      });

      let loading = toast.loading("Downloading PDF...");
      const htmlContent = generateChallanHTML(challan);

      try {
        const response = await axiosInstance.post(
          "/api/v1/pdf/generate-pdf",
          {
            htmlContent,
          },
          { responseType: "blob" }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(blob);
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = fileURL;
        document.body.appendChild(iframe);

        // Optional: Auto-download
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `${challan.challanNumber}-${challan.name.name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.remove(loading);
        toast.success("PDF downloaded successfully!");
      } catch (error) {
        console.log("pdf error", error);
        toast.error(error.response.data.message);
      }
    }
  };

  // Handle Edit (Redirect to edit page with index as query param)
  const handleEdit = (index) => {
    router.push(`/challan/add-challan/${index}`);
  };
  const handleToChat = (phone) => {
    if(typeof window !== "undefined"){
      const whatsappUrl = `https://wa.me/${phone}`;
      window.open(whatsappUrl, "_blank");
    }
   
  };
  useEffect(() => {
    fetchChallan();
  }, []);
  return (
    <>
      <div className="min-h-screen bg-gray-50 p-12">
        <h1 className="text-2xl font-bold mb-4">View Challans</h1>
        <table className="w-full border-collapse border bg-white shadow-md rounded-lg text-black">
          <thead>
            <tr className="bg-yellow-300">
              <th className="p-3 border">S No.</th>
              <th className="p-3 border">Party Name</th>
              <th className="p-3 border">Address</th>
              <th className="p-3 border">WhatsApp</th>
              <th className="p-3 border">Challan No.</th>
              <th className="p-3 border">Invoice No.</th>
              <th className="p-3 border">Total Bags</th>
              <th className="p-3 border">Total Amount</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {challans.length > 0 ? (
              challans.map((challan, index) => (
                <tr key={index} className="border-t text-center text-black">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{challan?.name?.name || "N/A"}</td>
                  <td className="p-3 border"> {challan?.address || "N/A"}</td>
                  <td
                    className="p-3 border cursor-pointer"
                    onClick={() => handleToChat(challan?.name?.whatsappNumber)}
                  >
                    {challan?.name?.whatsappNumber}
                    <span>
                      <FaWhatsapp />
                    </span>
                  </td>
                  <td className="p-3 border">
                    {challan.challanNumber || "N/A"}
                  </td>
                  <td className="p-3 border">
                    {challan.invoiceNumber || "N/A"}
                  </td>
                  <td className="p-3 border">{challan.totalBags || "N/A"}</td>
                  <td className="p-3 border">
                    ₹ {parseFloat(challan.totalAmount).toFixed(2)}
                  </td>
                  <td className="p-3 border">{challan.date || "N/A"}</td>

                  <td className="p-3 border flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(challan?._id)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(challan?._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleDownload(challan?._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-3 text-center text-gray-500">
                  No challans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ViewChallan;
