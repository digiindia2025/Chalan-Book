
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useToast } from "../app/hooks/use-toast";
import { initialTableDetails, initialProducts } from "../app/utils/tableData";
import { Button } from "../app/component/ui/button";

const TableInputRow = ({ index, item, handleInputChange, focusNextRow }) => {
  // Create refs for all input fields
  const qty1Ref = useRef(null);
  const shadeNo1Ref = useRef(null);
  const qty2Ref = useRef(null);
  const shadeNo2Ref = useRef(null);
  const qty3Ref = useRef(null);
  const shadeNo3Ref = useRef(null);
  
  // Handle tab press on qty1
  const handleQty1KeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      shadeNo1Ref.current?.focus();
    }
  };

  // Handle tab press on shadeNo1
  const handleShadeNo1KeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (focusNextRow) {
        focusNextRow(index, 1); // 1 indicates the first column pair
      }
    }
  };

  // Handle tab press on qty2
  const handleQty2KeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      shadeNo2Ref.current?.focus();
    }
  };

  // Handle tab press on shadeNo2
  const handleShadeNo2KeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (focusNextRow) {
        focusNextRow(index, 2); // 2 indicates the second column pair
      }
    }
  };

  // Handle tab press on qty3
  const handleQty3KeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      shadeNo3Ref.current?.focus();
    }
  };

  // Handle tab press on shadeNo3
  const handleShadeNo3KeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (focusNextRow) {
        focusNextRow(index, 3); // 3 indicates the third column pair
      }
    }
  };

  return (
    <tr className="border-t">
      <td className="p-3">{item.sNo}</td>
      <td className="p-3">
        <input
          ref={qty1Ref}
          type="number"
          value={item.qty1}
          onChange={(e) => handleInputChange(index, "qty1", e.target.value)}
          onKeyDown={handleQty1KeyDown}
          className="border p-2 rounded w-full bg-gray-50"
        />
      </td>
      <td className="p-3">
        <input
          ref={shadeNo1Ref}
          type="text"
          value={item.shadeNo1}
          onChange={(e) => handleInputChange(index, "shadeNo1", e.target.value)}
          onKeyDown={handleShadeNo1KeyDown}
          className="border p-2 rounded w-full bg-gray-50"
        />
      </td>
      <td className="p-3">
        <input
          ref={qty2Ref}
          type="number"
          value={item.qty2}
          onChange={(e) => handleInputChange(index, "qty2", e.target.value)}
          onKeyDown={handleQty2KeyDown}
          className="border p-2 rounded w-full bg-gray-50"
        />
      </td>
      <td className="p-3">
        <input
          ref={shadeNo2Ref}
          type="text"
          value={item.shadeNo2}
          onChange={(e) => handleInputChange(index, "shadeNo2", e.target.value)}
          onKeyDown={handleShadeNo2KeyDown}
          className="border p-2 rounded w-full bg-gray-50"
        />
      </td>
      <td className="p-3">
        <input
          ref={qty3Ref}
          type="number"
          value={item.qty3}
          onChange={(e) => handleInputChange(index, "qty3", e.target.value)}
          onKeyDown={handleQty3KeyDown}
          className="border p-2 rounded w-full bg-gray-50"
        />
      </td>
      <td className="p-3">
        <input
          ref={shadeNo3Ref}
          type="text"
          value={item.shadeNo3}
          onChange={(e) => handleInputChange(index, "shadeNo3", e.target.value)}
          onKeyDown={handleShadeNo3KeyDown}
          className="border p-2 rounded w-full bg-gray-50"
        />
      </td>
    </tr>
  );
};

const PackingDetails = () => {
  const { toast } = useToast();
  const [tableDetails, setTableDetails] = useState(initialTableDetails);
  const [products, setProducts] = useState(initialProducts);
  
  // Form fields
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [date, setDate] = useState("");
  const [driverName, setDriverName] = useState("");
  const [challanNo, setChallanNo] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [gst, setGst] = useState(0);
  const [tcsFare, setTcsFare] = useState(0);
  const [totalWeight, setTotalWeight] = useState("");
  const [totalBags, setTotalBags] = useState(0);
  
  // Calculated values
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  
  // Arrays of refs for each column's inputs
  const qty1Refs = useRef([]);
  const qty2Refs = useRef([]);
  const qty3Refs = useRef([]);

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
  const focusNextRow = (currentRowIndex, column) => {
    const nextRowIndex = currentRowIndex + 1;
    if (nextRowIndex < tableDetails.length) {
      // Focus the appropriate qty field based on column
      if (column === 1) {
        // Find the qty1 input of the next row and focus it
        const nextRowElement = document.querySelector(`tr:nth-child(${nextRowIndex + 1}) td:nth-child(2) input`);
        if (nextRowElement) {
          nextRowElement.focus();
        }
      } else if (column === 2) {
        // Find the qty2 input of the next row and focus it
        const nextRowElement = document.querySelector(`tr:nth-child(${nextRowIndex + 1}) td:nth-child(4) input`);
        if (nextRowElement) {
          nextRowElement.focus();
        }
      } else if (column === 3) {
        // Find the qty3 input of the next row and focus it
        const nextRowElement = document.querySelector(`tr:nth-child(${nextRowIndex + 1}) td:nth-child(6) input`);
        if (nextRowElement) {
          nextRowElement.focus();
        }
      }
    }
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
        Number(item.qty1 || 0) * Number(products[0]?.price || 0) +
        Number(item.qty2 || 0) * Number(products[1]?.price || 0) +
        Number(item.qty3 || 0) * Number(products[2]?.price || 0),
      0
    );

    setTotalPrice(calculatedTotalPrice);
  }, [tableDetails, products]);

  // Calculate grand total
  const grandTotal = useMemo(
    () => totalPrice + gst + tcsFare,
    [totalPrice, gst, tcsFare]
  );

  // Handle input change in the table body rows
  const handleInputChange = (rowIndex, field, value) => {
    const updatedTableDetails = [...tableDetails];
    if (field.includes('qty') && Number(value) < 0) {
      value = '0';
    }
    updatedTableDetails[rowIndex][field] = value;
    setTableDetails(updatedTableDetails);
  };

  // Handle changes to Product Name / Price in the table header
  const handleProductChange = (prodIndex, field, value) => {
    const updatedProducts = [...products];
    if (field === 'price' && Number(value) < 0) {
      updatedProducts[prodIndex][field] = '0';
    } else {
      updatedProducts[prodIndex][field] = value;
    }
    setProducts(updatedProducts);
  };

  // Handle form submission
  const handleSave = () => {
    // Validation
    if (!clientName) {
      toast({
        title: "Error",
        description: "Please select a client",
        variant: "destructive"
      });
      return;
    }

    if (!driverName) {
      toast({
        title: "Error",
        description: "Driver Name is required",
        variant: "destructive"
      });
      return;
    }

    // Success notification
    toast({
      title: "Success",
      description: "Packing details saved successfully!",
    });
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
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Mobile</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Driver Name</label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Challan No</label>
            <input
              type="text"
              value={challanNo}
              onChange={(e) => setChallanNo(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </section>

      {/* Packing Table */}
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
                  />
                </th>
              ))}
            </tr>

            {/* Column Headers Row */}
            <tr className="bg-yellow-200">
              <th className="p-3">S. No.</th>
              {products.map((_, i) => (
                <React.Fragment key={i}>
                  <th className="border p-2">Qty</th>
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
            <tr className="bg-yellow-200 font-bold">
              <td className="p-3">@Price</td>
              {products.map((product, i) => (
                <td key={i} colSpan={2} className="border p-3">
                  <input
                    type="number"
                    placeholder="Product Price"
                    value={product.price}
                    onChange={(e) => handleProductChange(i, "price", e.target.value)}
                    className="w-full p-2 border rounded bg-gray-50"
                  />
                </td>
              ))}
            </tr>

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
                    Number(products[1]?.price || 0) *
                    100
                ) / 100}
              </td>
              <td className="border p-3" colSpan={2}>
                {Math.round(
                  tableDetails.reduce(
                    (sum, item) => sum + Number(item.qty3 || 0),
                    0
                  ) *
                    Number(products[2]?.price || 0) *
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
                type="number"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="border p-2 rounded w-40"
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
                type="number"
                value={gst}
                onChange={(e) => setGst(Number(e.target.value))}
                className="border p-2 rounded w-40"
              />
            </div>

            <div className="flex justify-between mb-2">
              <span>TCS/FARE</span>
              <input
                type="number"
                value={tcsFare}
                onChange={(e) => setTcsFare(Number(e.target.value))}
                className="border p-2 rounded w-40"
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
                  className="border p-2 rounded w-40"
                />
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Total Bags</span>
                <input
                  type="number"
                  value={totalBags}
                  onChange={(e) => setTotalBags(Number(e.target.value))}
                  className="border p-2 rounded w-40"
                />
              </div>
            </div>
          </div>
        </div>

        <Button 
          className="mt-4 bg-blue-600 hover:bg-blue-700"
          onClick={handleSave}
        >
          Save Packing Details
        </Button>
      </section>
    </div>
  );
};

export default PackingDetails;
