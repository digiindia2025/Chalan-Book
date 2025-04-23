
"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { toast } from 'react-toastify';
import { useToast } from "../ui/use-toast";
import { initialTableDetails, initialProducts } from "../../utils/tableData";
import TableInputRow from "./TableInputRow";
import { Button } from "../ui/button";
import axiosInstance from "../../../util/axiosInstance";
import { useRouter } from "next/navigation";
import { toast as notify } from "react-hot-toast";
import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigation";
import {getPrintableHTML} from "../../utils/getPrintTable"


const clearOriginalTable = () => {
  initialTableDetails.forEach((row) => {
    for (const key in row) {
      if (key !== "sNo" && typeof row[key] === "string") {
        row[key] = "";
      }
    }
  });
};
const clearOriginalProduct = () => {
  initialProducts.forEach((row) => {
    for (const key in row) {
      if (typeof row[key] === "string") {
        row[key] = "";
      }
    }
  });
};

type Clients = {
  _id: string;
  name: string;
  company: string;
  Address?: string;
  phoneNumber?: string;
  // Add any other properties
};


interface Product {
  name: string;
  price: string;
}

interface TableRowItem {
  sNo: number;
  qty1: string;
  shadeNo1: string;
  qty2: string;
  shadeNo2: string;
  qty3: string;
  shadeNo3: string;
  [key: string]: string | number; // Add index signature to allow string indexing
}

interface Client {
  _id: string;
  name: string;
  company: string;
  Address?: string;
  phoneNumber?: string;
  // Add other relevant client properties
}

// ////////////////////////////aman/////////////////////
const handleProductKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  index: number
) => {
  const key = e.key;

  if (key === "ArrowRight") {
    e.preventDefault();
    const nextInput = document.getElementById(`product-input-${index + 1}`) as HTMLInputElement | null;
    nextInput?.focus();
  } else if (key === "ArrowLeft") {
    e.preventDefault();
    const prevInput = document.getElementById(`product-input-${index - 1}`) as HTMLInputElement | null;
    prevInput?.focus();
  } else if (key === "ArrowDown") {
    e.preventDefault();
    const downInput = document.getElementById(`product-input-${index + 5}`) as HTMLInputElement | null; // assuming 5 inputs per row
    downInput?.focus();
  } else if (key === "ArrowUp") {
    e.preventDefault();
    const upInput = document.getElementById(`product-input-${index - 5}`) as HTMLInputElement | null;
    upInput?.focus();
  } else if (key === "Enter") {
    e.preventDefault(); // Prevent default Enter behavior
    const nextInput = document.getElementById(`product-input-${index + 1}`) as HTMLInputElement | null;
    nextInput?.focus();
  }
};


const PackingDetails: React.FC = () => {
  const router=useRouter();
  const { toast } = useToast();
  const [tableDetails, setTableDetails] = useState<TableRowItem[]>(initialTableDetails);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [partyName, setPartyName] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [date, setDate] = useState("");
  const [driverName, setDriverName] = useState("");
  const [challanNo, setChallanNo] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [gst, setGst] = useState<number>(0);
  const [tcsFare, setTcsFare] = useState<number | string>("");
  const [totalWeight, setTotalWeight] = useState("");
   const [totalBags, setTotalBags] = useState<string | number>("");

  const [disabled, setDisabled] = useState(false);

  const [clients, setClients] = useState<Clients[]>([]);

  // Calculated values
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  
  // Arrays of refs for each column's inputs
  const qty1Refs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
  const qty2Refs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
  const qty3Refs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);

  // /////////////////////////////aman/////////////////////
  const summaryInputRefs = useRef<(HTMLInputElement | null)[]>([]);



  // Initialize refs for each row when component mounts
  useEffect(() => {
    qty1Refs.current = Array(tableDetails.length)
      .fill(null)
      .map((_, i) => qty1Refs.current[i] || React.createRef());
    
    qty2Refs.current = Array(tableDetails.length)
      .fill(null)
      .map((_, i) => qty2Refs.current[i] || React.createRef());
    
    qty3Refs.current = Array(tableDetails.length)
      .fill(null)
      .map((_, i) => qty3Refs.current[i] || React.createRef());
  }, [tableDetails.length]);

  
  // Function to focus on the qty input of the next row based on column
  const focusNextRow = (currentRowIndex: number, column: number) => {
    const nextRowIndex = currentRowIndex + 1;
    if (nextRowIndex < tableDetails.length) {
      // Focus the appropriate qty field based on column
      if (column === 1) {
        // Find the qty1 input of the next row and focus it
        const nextRowElement = document.querySelector(`tr:nth-child(${nextRowIndex + 1}) td:nth-child(2) input`) as HTMLInputElement;
        if (nextRowElement) {
          nextRowElement.focus();
        }
      } else if (column === 2) {
        // Find the qty2 input of the next row and focus it
        const nextRowElement = document.querySelector(`tr:nth-child(${nextRowIndex + 1}) td:nth-child(4) input`) as HTMLInputElement;
        if (nextRowElement) {
          nextRowElement.focus();
        }
      } else if (column === 3) {
        // Find the qty3 input of the next row and focus it
        const nextRowElement = document.querySelector(`tr:nth-child(${nextRowIndex + 1}) td:nth-child(6) input`) as HTMLInputElement;
        if (nextRowElement) {
          nextRowElement.focus();
        }
      }
    }
  };
 const handlePrint = () => {
  const newChallan = {
    tableDetails,
    partyName,
    address,
    mobile,
    date,
    invoiceNo,
    gst,
    totalQty,
    totalWeight,
    totalBags,
    grandTotal,
    products,
    companyName: clientName,
  };


  let detailsCol1 = newChallan.tableDetails
    .map((item) => {
      return {
        quantity: parseFloat(item.qty1),
        shadeNumber: item.shadeNo1,
      };
    })
    .filter(
      (item) =>
        item.quantity &&
        !isNaN(item.quantity) &&
        item.shadeNumber &&
        item.shadeNumber.trim() !== ""
    );

  let detailCol2 = newChallan.tableDetails
    .map((item) => {
      return {
        quantity: parseFloat(item.qty2),
        shadeNumber: item.shadeNo2,
      };
    })
    .filter(
      (item) =>
        item.quantity &&
        !isNaN(item.quantity) &&
        item.shadeNumber &&
        item.shadeNumber.trim() !== ""
    );
  let detailCol3 = newChallan.tableDetails
    .map((item) => {
      return {
        quantity: parseFloat(item.qty3),
        shadeNumber: item.shadeNo3,
      };
    })
    .filter(
      (item) =>
        item.quantity &&
        !isNaN(item.quantity) &&
        item.shadeNumber &&
        item.shadeNumber.trim() !== ""
    );

  if (
    (detailsCol1.length > 0 && !newChallan.products[0].name)
  ) {
    return notify.error("Please fill product name for product 1 ");
  }
  if (
    (detailCol2.length > 0 && !newChallan.products[1].name) 
  ) {
    return notify.error("Please fill product name for product 2");
  }
  if (
    (detailCol3.length > 0 && !newChallan.products[2].name) 
  ) {
    return notify.error("Please fill product name for product 3");
  }

  const productVal = newChallan.products
    ?.map((product, i) => ({
      productName: product.name,
      details: i === 0 ? detailsCol1 : i === 1 ? detailCol2 : detailCol3,
    }))
    .filter((product) => {
      return product.productName;
    });


  const transformedData = {
    clientId: clientId,
    name: { name: clientName },
    address: newChallan.address,
    mobile: newChallan.mobile,
    date: newChallan.date,
    driverName: driverName,
    challanNumber: challanNo,
    products: productVal,
    price1: products[0]?.price || 0,
    price2: products[1]?.price || 0,
    price3: products[2]?.price || 0,
    totalRollQty: totalQty,
    basicAmount: totalPrice,
    GSTNumber: gst,
    totalAmount: grandTotal,
    reciverName: newChallan.partyName,
    totalWeight: newChallan.totalWeight,
    totalBags: newChallan.totalBags,
    totalPrice: totalPrice,
    tCSOrFARE: tcsFare,
    invoiceNumber: parseInt(newChallan.invoiceNo),
    company: clientName,
  };  


    const htmlContent = getPrintableHTML(transformedData);
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(htmlContent);
    printWindow?.document.close();
    printWindow?.focus();
    printWindow?.print();
  };
  // Calculate total quantity
  const calculatedTotalQty = useMemo(() => 
    tableDetails.reduce(
      (sum, item) => 
        sum + 
        Number(item.qty1 || 0) + 
        Number(item.qty2 || 0) + 
        Number(item.qty3 || 0),
      0
    ),
    [tableDetails]
  );

  // Update totalQty when calculatedTotalQty changes
  useEffect(() => {
    setTotalQty(calculatedTotalQty);
  }, [calculatedTotalQty]);

  // Calculate total price
  useEffect(() => {
    const calculatedTotalPrice = tableDetails.reduce(
      (sum, item) =>
        sum +
        Number(item.qty1 || 0) * Number(products[0].price || 0) +
        Number(item.qty2 || 0) * Number(products[1].price || 0) +
        Number(item.qty3 || 0) * Number(products[2].price || 0),
      0
    );

    setTotalPrice(calculatedTotalPrice);
  }, [tableDetails, products]);

  // Calculate grand total
  const grandTotal = useMemo(
    () => totalPrice + gst + (typeof tcsFare === "number" ? tcsFare : Number(tcsFare)),
    [totalPrice, gst, tcsFare]
  );

  // Handle input change in the table body rows
  const handleInputChange = (rowIndex: number, field: string, value: string) => {
    const updatedTableDetails = [...tableDetails];
    if (field.includes('qty') && Number(value) < 0) {
      value = '0';
    }
    updatedTableDetails[rowIndex][field] = value;
    setTableDetails(updatedTableDetails);
  };

  const handleTotalBagesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      try {
        console.log("tb", totalWeight);
        
        if (totalWeight.toString().startsWith("=")) {
          const formula = totalWeight.toString().slice(1); 
          const evaluated = eval(formula); 
          console.log("evaluated", evaluated);
          setTotalWeight(evaluated);
        } 
      } catch (err) {
        setTotalWeight("Error in formula");
      }
    }
  }

  // Handle changes to Product Name / Price in the table header
  const handleProductChange = (prodIndex: number, field: keyof Product, value: string) => {
    const updatedProducts = [...products];
    if (field === 'price' && Number(value) < 0) {
      updatedProducts[prodIndex][field] = '0';
    } else {
      updatedProducts[prodIndex][field] = value;
    }
    setProducts(updatedProducts);
  };

  // Handle form submission
  const handleSave = async() => {
    const newChallan = {
      tableDetails,
      partyName,
      address,
      mobile,
      date,
      invoiceNo,
      gst,
      totalQty,
      totalWeight,
      totalBags,
      grandTotal,
      products,
      companyName: clientName,
    };


    let detailsCol1 = newChallan.tableDetails
      .map((item) => {
        return {
          quantity: parseFloat(item.qty1),
          shadeNumber: item.shadeNo1,
        };
      })
      .filter(
        (item) =>
          item.quantity &&
          !isNaN(item.quantity) &&
          item.shadeNumber &&
          item.shadeNumber.trim() !== ""
      );

    let detailCol2 = newChallan.tableDetails
      .map((item) => {
        return {
          quantity: parseFloat(item.qty2),
          shadeNumber: item.shadeNo2,
        };
      })
      .filter(
        (item) =>
          item.quantity &&
          !isNaN(item.quantity) &&
          item.shadeNumber &&
          item.shadeNumber.trim() !== ""
      );
    let detailCol3 = newChallan.tableDetails
      .map((item) => {
        return {
          quantity: parseFloat(item.qty3),
          shadeNumber: item.shadeNo3,
        };
      })
      .filter(
        (item) =>
          item.quantity &&
          !isNaN(item.quantity) &&
          item.shadeNumber &&
          item.shadeNumber.trim() !== ""
      );

    if (
      (detailsCol1.length > 0 && !newChallan.products[0].name)
    ) {
      return notify.error("Please fill product name for product 1 ");
    }
    if (
      (detailCol2.length > 0 && !newChallan.products[1].name) 
    ) {
      return notify.error("Please fill product name for product 2");
    }
    if (
      (detailCol3.length > 0 && !newChallan.products[2].name) 
    ) {
      return notify.error("Please fill product name for product 3");
    }

    const productVal = newChallan.products
      ?.map((product, i) => ({
        productName: product.name,
        details: i === 0 ? detailsCol1 : i === 1 ? detailCol2 : detailCol3,
      }))
      .filter((product) => {
        return product.productName;
      });


    const transformedData = {
      clientId: clientId,
      
      address: newChallan.address,
      mobile: newChallan.mobile,
      date: newChallan.date,
      driverName: driverName,
      challanNumber: challanNo,
      products: productVal,
      price1: products[0]?.price,
      price2: products[1]?.price,
      price3: products[2]?.price,
      totalRollQty: totalQty,
      basicAmount: totalPrice,
      GSTNumber: gst,
      totalAmount: grandTotal,
      reciverName: newChallan.partyName,
      totalWeight: newChallan.totalWeight,
      totalBags: newChallan.totalBags,
      totalPrice: totalPrice,
      tCSOrFARE: tcsFare,
      invoiceNumber: parseInt(newChallan.invoiceNo),
      company: clientName,
    };  
    console.log("transformedData", transformedData);
    console.log("partyName", newChallan.partyName);
    console.log("cliename", clientName);
    
    
    

    try {
      setDisabled(true);
      const response = await axiosInstance.post(
        "/api/v1/challan/create-challan",
        transformedData
      );
      // let loading = toast.loading("Challan is being saved...");
      if (response.status === 201) {
        // toast.remove(loading);
        notify.success("Challan saved successfully!");
        clearOriginalTable()
        clearOriginalProduct()
        setDisabled(false);
        router.push("/");
      }
    } catch (error) {
      console.log("error", error);
      setDisabled(false);
      if (error.response) {
        notify.error(error.response.data.message);
      }
    }
  };

  const fetchClient = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/client/get-all-client");
      console.log("response", response.data);

      setClients(response.data.client);
    } catch (error) {
      if (error.response) {
        notify.error(error.response.data.message);
      }
    }
  };
// i am added data chcek save succesfully in console
  const dataToLog = {
    clientName,
    address,
    mobile,
    date,
    driverName,
    challanNo,
    invoiceNo,
    gst,
    tcsFare,
    totalWeight,
    totalBags,
    tableDetails,
    products,
    company: clientName,
    
  };
  // console.log("Data to be saved:", dataToLog);

  const handleClientChange = (e) => {
    let clientName = e.target.value;

    setPartyName(clientName);
 
    // Find selected client details
    const selectedClient = clients.find((c) => c.company === clientName);
    if (selectedClient) {
    setClientName(selectedClient.name)
      setAddress(selectedClient.Address || "");
      setMobile(selectedClient.phoneNumber || "");
      setClientId(selectedClient._id);
    } else {
      setAddress("");
      setMobile("");
    }
  };
  const fetchChallanCount=async()=>{
    try {
      const response = await axiosInstance.get("/api/v1/challan/challan-count");
  const totalCount=Number(response?.data?.count) + 530;
  const value=totalCount.toString();
      setChallanNo(value);
    } catch (error) {
      if (error.response) {
        notify.error(error.response.data.message);
      }
    }
  }
  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
    fetchClient();
    fetchChallanCount()
  }, []);

  const handleGstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setGst(value);
  }
  const handleTotalBagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = Number(e.target.value);
    setTotalBags(value);
  }
  const handleldkjfl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setGst(value);
  }

// some changes added by aman tiwari

// Changed: Reorganized refs and navigation state
const priceInputRefs = useRef<(HTMLInputElement | null)[]>([]);
const invoiceInputRef = useRef<HTMLInputElement>(null);
const gstInputRef = useRef<HTMLInputElement>(null);
const tcsInputRef = useRef<HTMLInputElement>(null);
const weightInputRef = useRef<HTMLInputElement>(null);
const bagsInputRef = useRef<HTMLInputElement>(null);
// const [currentPriceIndex, setCurrentPriceIndex] = useState<number>(0);
const [currentSection, setCurrentSection] = useState<'prices' | 'invoice' | 'totals'>('prices');


// useKeyboardNavigation({
//   enabled: currentSection === 'prices', // ✅ Only enable in 'prices' section
//   onLeft: () => {
//     if (currentSection === 'prices' && currentPriceIndex > 0) {
//       setCurrentPriceIndex(prev => prev - 1);
//       priceInputRefs.current[currentPriceIndex - 1]?.focus();
//     } else if (currentSection === 'invoice') {
//       if (document.activeElement === gstInputRef.current) {
//         invoiceInputRef.current?.focus();
//       } else if (document.activeElement === tcsInputRef.current) {
//         gstInputRef.current?.focus();
//       }
//     } else if (currentSection === 'totals') {
//       if (document.activeElement === bagsInputRef.current) {
//         weightInputRef.current?.focus();
//       }
//     }
//   },
//   onRight: () => {
//     if (currentSection === 'prices' && currentPriceIndex < 2) {
//       setCurrentPriceIndex(prev => prev + 1);
//       priceInputRefs.current[currentPriceIndex + 1]?.focus();
//     } else if (currentSection === 'invoice') {
//       if (document.activeElement === invoiceInputRef.current) {
//         gstInputRef.current?.focus();
//       } else if (document.activeElement === gstInputRef.current) {
//         tcsInputRef.current?.focus();
//       }
//     } else if (currentSection === 'totals') {
//       if (document.activeElement === weightInputRef.current) {
//         bagsInputRef.current?.focus();
//       }
//     }
//   },
//   onUp: () => {
//     if (currentSection === 'invoice') {
//       if (document.activeElement === gstInputRef.current) {
//         invoiceInputRef.current?.focus();
//       } else if (document.activeElement === tcsInputRef.current) {
//         gstInputRef.current?.focus();
//       }
//     } else if (currentSection === 'totals') {
//       if (document.activeElement === bagsInputRef.current) {
//         weightInputRef.current?.focus();
//       }
//     }
//   },
//   onDown: () => {
//     if (currentSection === 'invoice') {
//       if (document.activeElement === invoiceInputRef.current) {
//         gstInputRef.current?.focus();
//       } else if (document.activeElement === gstInputRef.current) {
//         tcsInputRef.current?.focus();
//       }
//     } else if (currentSection === 'totals') {
//       if (document.activeElement === weightInputRef.current) {
//         bagsInputRef.current?.focus();
//       }
//     }
//   }
// });


const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    const next = inputRefs.current[index + 1];
    if (next) next.focus();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    const prev = inputRefs.current[index - 1];
    if (prev) prev.focus();
  }
};

const renderProductPricesRow = () => (
  <tr className="bg-yellow-200 font-bold">
    <td className="p-3">@Price</td>
    {products.map((product, i) => (
      <td key={i} colSpan={2} className="border p-3">
        <input
          type="text"
          placeholder="Product Price"
          value={product.price || ""}
          onChange={(e) => handleProductChange(i, "price", e.target.value)}
          className="w-full p-2 border rounded bg-gray-50"
          ref={(el) => {
            inputRefs.current[i] = el; // store ref
          }} // store ref
          onKeyDown={(e) => handleKeyDown(e, i)} // handle arrow keys
        />
      </td>
    ))}
  </tr>
);
// ///////////////////////////////////aman//////////////////////
const handleSummaryKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  index: number
) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const next = summaryInputRefs.current[index + 1];
    if (next) next.focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    const prev = summaryInputRefs.current[index - 1];
    if (prev) prev.focus();
  }
};





  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 p-4 md:p-8">
      <header className="bg-yellow-100 py-4 px-6 shadow-lg rounded-lg flex justify-between items-center text-xl font-semibold text-gray-800 mb-6">
        <h1>Packing Details</h1>
        <Button variant="outline">View Challans</Button>
      </header>

      {/* Client Details Form */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="space-y-2">
            <label className="block font-medium">Client Name</label>

            <select
              value={partyName}
              onChange={handleClientChange}
              className="w-full p-2 border rounded bg-black text-white"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client?._id} value={client?.company}>
                  {client?.name}
                </option>
              ))}
             
            </select>
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Mobile</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Driver Name</label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Challan No</label>
            <input
              type="text"
              value={challanNo}
              onChange={(e) => setChallanNo(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
            />
          </div>
        </div>
      </section>

      {/* Packing Table */}
      {/* /////////////////////////aman//////////////// */}
      
      <section className="bg-white shadow-md rounded-lg p-6 mb-8 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* Products Row */}
            <tr className="bg-yellow-300">
              <th className="p-3" />
              {products.map((product, i) => (
                <th key={i} colSpan={2} className="border p-2">
                <input
  type="text"
  placeholder="Product Name"
  className="w-full p-2 border rounded bg-gray-50"
  value={product.name}
  onChange={(e) => handleProductChange(i, "name", e.target.value)}
  onKeyDown={(e) => handleProductKeyDown(e, i)}
  id={`product-input-${i}`}
/>

                </th>
              ))}
            </tr>

            

            {/* Column Headers Row */}
            <tr className="bg-yellow-200">
              <th className="p-3">S. No.</th>
              {products.map((_, i) => (
                <React.Fragment key={i}>
                  <th className="border p-2" >Qty</th>
                  <th className="border p-2">Shade No</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {tableDetails.map((item, index) => (
              <TableInputRow
                key={index}
                index={index}
                item={item}
                handleInputChange={handleInputChange}
                focusNextRow={focusNextRow}
              />
            ))}

            {/* Totals Row */}
            <tr className="bg-yellow-100 font-bold">
              <td className="p-3">T.QTY</td>
              <td className="border p-3" colSpan={2}>
                {Math.round(
                  tableDetails.reduce(
                    (sum, item) => sum + Number(item.qty1 || 0),
                    0
                  ) * 100
                ) / 100}
              </td>
              <td className="border p-3" colSpan={2}>
                {Math.round(
                  tableDetails.reduce(
                    (sum, item) => sum + Number(item.qty2 || 0),
                    0
                  ) * 100
                ) / 100}
              </td>
              <td className="border p-3" colSpan={2}>
                {Math.round(
                  tableDetails.reduce(
                    (sum, item) => sum + Number(item.qty3 || 0),
                    0
                  ) * 100
                ) / 100}
              </td>
            </tr>

            {/* Product Prices Row */}
            {/* <tr className="bg-yellow-200 font-bold">
              <td className="p-3">@Price</td>
              {products.map((product, i) => (
                <td key={i} colSpan={2} className="border p-3">
                  <input
                    type="text"
                    placeholder="Product Price"
                    value={product.price}
                    onChange={(e) => handleProductChange(i, "price", e.target.value)}
                    className="w-full p-2 border rounded bg-gray-50"
                  />
                </td>
              ))}
            </tr> */}
{/* added by aman */}
            {renderProductPricesRow()}


            {/* Total Prices Row */}
            <tr className="bg-yellow-300 font-bold">
              <td className="p-3">T.Price</td>
              <td className="border p-3" colSpan={2}>
                {Math.round(
                  tableDetails.reduce(
                    (sum, item) => sum + Number(item.qty1 || 0),
                    0
                  ) *
                    Number(products[0]?.price || 0) *
                    100
                ) / 100}
              </td>
              <td className="border p-3" colSpan={2}>
                {Math.round(
                  tableDetails.reduce(
                    (sum, item) => sum + Number(item.qty2 || 0),
                    0
                  ) *
                    Number(products[1].price || 0) *
                    100
                ) / 100}
              </td>
              <td className="border p-3" colSpan={2}>
                {Math.round(
                  tableDetails.reduce(
                    (sum, item) => sum + Number(item.qty3 || 0),
                    0
                  ) *
                    Number(products[2].price || 0) *
                    100
                ) / 100}
              </td>
            </tr>

            {/* Grand Total Row */}
            <tr className="bg-yellow-400 font-bold">
              <td className="p-3">Total Price</td>
              <td className="border p-3" colSpan={6}>
                {Math.round(totalPrice * 100) / 100}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Summary Section */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-8">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-yellow-100 p-4 rounded-lg">
      <div className="flex justify-between mb-2">
        <span>Invoice No.</span>
        <input
          type="text"
          value={invoiceNo || ""}
          onChange={(e) => setInvoiceNo(e.target.value)}
          className="border p-2 rounded w-40 bg-white text-black"
          ref={(el) => {
            summaryInputRefs.current[0] = el;
          }}
          onFocus={() => setCurrentSection('invoice')}
          onKeyDown={(e) => handleSummaryKeyDown(e, 0)}
        />
      </div>

      <div className="flex justify-between py-2 font-semibold">
        <span>Total Roll Qty</span>
        <span>{Math.round(totalQty * 100) / 100}</span>
      </div>

      <div className="flex justify-between py-2 font-semibold">
        <span>Basic Amount</span>
        <span>{Math.round(totalPrice * 100) / 100}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>GST</span>
        <input
          type="text"
          value={gst || ""}
          onChange={(e) => setGst(Number(e.target.value))}
          className="border p-2 rounded w-40 bg-white text-black"
          ref={(el) => {
            summaryInputRefs.current[1] = el;
          }}
          onFocus={() => setCurrentSection('invoice')}
          onKeyDown={(e) => handleSummaryKeyDown(e, 1)}
        />
      </div>

      <div className="flex justify-between mb-2">
        <span>TCS/FARE</span>
        <input
          type="text"
          value={tcsFare || ""}
          onChange={(e) => setTcsFare(Number(e.target.value))}
          className="border p-2 rounded w-40 bg-white text-black"
          ref={(el) => {
            summaryInputRefs.current[2] = el;
          }}
          onFocus={() => setCurrentSection('invoice')}
          onKeyDown={(e) => handleSummaryKeyDown(e, 2)}
        />
      </div>

      <div className="flex justify-between bg-yellow-300 p-3 rounded-lg font-bold">
        <span>Total Amount</span>
        <span>₹ {Math.round(grandTotal * 100) / 100}</span>
      </div>
    </div>

    <div className="bg-yellow-100 p-4 rounded-lg">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-between mb-2">
          <span>Total Weight</span>
          <input
            type="text"
            value={totalWeight}
            onChange={(e) => setTotalWeight(e.target.value)}
            onKeyDown={handleTotalBagesKeyDown}
            className="border p-2 rounded w-40 bg-white text-black"
            ref={(el) => { summaryInputRefs.current[3] = el; }}
            onFocus={() => setCurrentSection('totals')}
            // onKeyDown={(e) => handleSummaryKeyDown(e, 3)}
          />
        </div>

        <div className="flex justify-between mb-2">
          <span>Total Bags</span>
          <input
            type="text"
            value={totalBags}
            onChange={(e) => setTotalBags(Number(e.target.value))}
            // onKeyDown={handleTotalBagesKeyDown}
            className="border p-2 rounded w-40 bg-white text-black"
            ref={(el) => { summaryInputRefs.current[4] = el; }}
            onFocus={() => setCurrentSection('totals')}
            onKeyDown={(e) => handleSummaryKeyDown(e, 4)}
          />
        </div>
      </div>
    </div>
  </div>
{/* </section> */}

        <button
          onClick={handleSave}
          disabled={disabled}
          className="btn btn-primary mt-4"
        >
          Add Challan
        </button>
        <button
          onClick={handlePrint}
         
          className="float-right bg-red-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 mt-4"
        >
          Print Challan
        </button>
       
      </section>
    </div>
  );
};

export default PackingDetails;
