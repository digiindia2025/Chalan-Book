"use client";
import axiosInstance from "../../util/axiosInstance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import * as XLSX from "xlsx";
import { formatDate, formatPrice } from "../constant";

function Client() {
  const [clients, setClients] = useState([]);
  const [challans, setChallans] = useState([]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [filteredChallans, setFilteredChallans] = useState([]);

  const fetchClient = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/client/get-all-client");

      setClients(response.data.client);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };
  useEffect(() => {
    fetchClient();
  }, []);

  const handleToChat = (phone) => {
    if(typeof window !== "undefined"){
      const whatsappUrl = `https://wa.me/${phone}`;
      window.open(whatsappUrl, "_blank");
    }
  
  };

 

  const handleDelete = (id) => {
    toast((t) => (
      <div className="space-y-2">
        <p>Are you sure you want to delete this client. Do you wish to proceed?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id); // Close the confirmation toast
              try {
                const response = await axiosInstance.delete(
                  `/api/v1/client/delete-client/${id}`
                );
                if (response.status === 200) {
                  toast.success("Client deleted successfully!");
                  fetchClient(); // Refresh client list
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
      duration: 10000, // Optional: auto-dismiss after 10s
    });
  };
  const router = useRouter();
  const handleToEdit = (id) => {
    router.push(`/client/add-client/${id}`);
  };

  const handelViewChallan = (companyName, challan) => {
    setSelectedClient(companyName);
    setFilteredChallans(challan.reverse());
  };

  const handleChallanEdit = (index) => {
    router.push(`/challan/add-challan/${index}`);
  };

  const handleChallanDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/api/v1/challan/delete-challan/${id}`
      );
      if (response.status === 200) {
        toast.success("Challan deleted successfully!");
        setFilteredChallans(
          filteredChallans.filter((challan) => challan._id !== id)
        );
      }
    } catch (error) {
      console.log("delete error", error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
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

  const handleChallanDownload = async (challanVal) => {
    let challan = [challanVal];
    console.log("challan", challan);
    if (challan && challan.length > 0) {
      let loading = toast.loading("Downloading PDF...");
      const htmlContent = generateChallanHTML(challanVal);

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
        link.download = `${challanVal.challanNumber}-${challanVal.name.name}.pdf`;

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

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredChallans.map((item) => ({
        "Challan No.": item?.challanNumber,
        "Company Name": item?.reciverName,
        "Party Name": item?.name?.name,
        Date: formatDate(item?.date), // Make sure the 'formatDate' function formats correctly
        "Total Price": formatPrice(item?.totalAmount), // Ensure formatPrice is properly implemented
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Challan");
    XLSX.writeFile(workbook, "Challan.xlsx");
  };

  return (
    <div className="mt-6 w-full min-h-screen p-6 rounded-lg shadow-lg bg-white">
      <div className="mt-4 flex gap-4">
        <h2 className="text-2xl font-semibold mb-4 text-black">Clients List</h2>
        <Link href={"/client/add-client"}>
          <button className="px-4 py-2 mb-2 btn text-white rounded-lg shadow-md btn-warning">
            Add Client
          </button>
        </Link>
      </div>

      <table className="w-full border-collapse border bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-yellow-400 text-black">
            <th className="p-3 border">Company</th>
            <th className="p-3 border">Party Name</th>
            <th className="p-3 border">Phone</th>
            <th className="p-3 border">WhatsApp</th>
            <th className="p-3 border">Address</th>
            <th className="p-3 border">GST No</th>
            <th className="p-3 border">Challans</th>
            <th className="p-3 border">Edit</th>
            <th className="p-3 border">Delete</th>
          </tr>
        </thead>
        <tbody>
          {clients?.length > 0 ? (
            clients.map((c, index) => (
              <React.Fragment key={index}>
                <tr className="border-t hover:bg-gray-100 text-black">
                  <td className="p-3 border">{c.company}</td>
                  <td className="p-3 border">{c.name}</td>
                  <td className="p-3 border">{c.phoneNumber}</td>
                  <td
                    className="p-3 border cursor-pointer"
                    onClick={() => handleToChat(c.whatsappNumber)}
                  >
                    {c.whatsappNumber}
                    <span>
                      <FaWhatsapp />
                    </span>
                  </td>
                  <td className="p-3 border">{c.Address}</td>
                  <td className="p-3 border">{c.GSTNumber}</td>

                  {/* View Challans Button */}
                  <td className="p-3 border">
                    <button
                      onClick={() => handelViewChallan(c.company, c.challan)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md"
                    >
                      View ({c.challan.length})
                    </button>
                  </td>

                  <td className="p-3 border">
                    <button
                      onClick={() => handleToEdit(c._id)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                  </td>

                  <td className="p-3 border">
                    <button
                      onClick={() => handleDelete(c?._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {/* Display Challans when View button is clicked */}
                {selectedClient === c.company && (
                  <tr className="bg-gray-50">
                    <td className="p-3 border" colSpan="9">
                      <div className="mt-4 flex justify-end gap-4">
                        {/* <button
                          onClick={'handleDownloadPDF'}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Download PDF
                        </button> */}
                        <button
                          onClick={handleDownloadExcel}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Download Excel
                        </button>
                      </div>

                      <h3>Challans for {c.company}</h3>
                      {filteredChallans.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border bg-white rounded-lg shadow-sm">
                            <thead>
                              <tr className="bg-gray-300 text-black">
                                <th className="p-2 border">Challan No.</th>
                                {/* <th className="p-2 border">Invoice No.</th> */}
                                <th className="p-2 border">Date</th>
                                <th className="p-2 border">Total</th>
                                {/* <th className="p-2 border">Address</th> */}
                                <th className="p-2 border">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredChallans.map((challan, i) => (
                                <tr key={i} className="border-t text-black">
                                  <td className="p-2 border">
                                    {challan.challanNumber}
                                  </td>
                                  {/* <td className="p-2 border">{challan.invoiceNumber}</td> */}
                                  <td className="p-2 border">{challan.date}</td>
                                  <td className="p-2 border">
                                    ₹{" "}
                                    {parseFloat(challan.totalAmount).toFixed(2)}
                                  </td>
                                  {/* <td className="p-2 border">{challan.address}</td> */}
                                  <td className="p-2 border flex justify-center items-center gap-4">
                                    <button
                                      onClick={() =>
                                        handleChallanEdit(challan?._id)
                                      }
                                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleChallanDelete(challan?._id)
                                      }
                                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                      Delete
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleChallanDownload(challan)
                                      }
                                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                      Download
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Total Amount Row */}
                          <div className="flex justify-start p-4 bg-gray-200">
                            <div className="font-semibold text-lg mr-100 text-gray-900">
                              Total: ₹{" "}
                              {filteredChallans
                                .reduce(
                                  (acc, challan) => acc + challan.totalAmount,
                                  0
                                )
                                .toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          No challans available.
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center p-4 text-gray-500">
                No clients found. Please add some clients.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Client;
