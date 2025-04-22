"use client";
import { useEffect, useState } from "react";

const ChallanForm = ({ data }) => {
  
  const [rows, setRows] = useState(data || []);


  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      {/* Client Details */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="font-bold block">Client Name</label>
          <select className="border p-2 w-full">
            <option>Select Client</option>
          </select>
        </div>
        <div>
          <label className="font-bold block">Address</label>
          <input type="text" className="border p-2 w-full" />
        </div>
        <div>
          <label className="font-bold block">Mob</label>
          <input type="text" className="border p-2 w-full" />
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-yellow-400">
            <th className="border p-2">S. No.</th>
            <th className="border p-2">Product Name</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Shade No</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr key={index}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{row.productName}</td>
                <td className="border p-2">{row.qty}</td>
                <td className="border p-2">{row.shadeNo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="border p-4 text-center">
                No Data Available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        <button className="px-6 py-2 bg-blue-500 text-white rounded">
          Add Challan
        </button>
      </div>
    </div>
  );
};

export default ChallanForm;
