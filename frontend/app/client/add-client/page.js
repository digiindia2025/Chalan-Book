"use client";
import axiosInstance from "../../../util/axiosInstance"; // ✅ Check the correct number of "../"
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function AddClient() {
  const { id } = useParams();
  const router = useRouter();

  let DefaultData = {
    company: "",
    contactPerson: "",
    phone: "",
    whatsapp: "",
    address: "",
    gstNo: "",
  };

  const [client, setClient] = useState(DefaultData);
 
  const handleChange = (e) => {

    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!client.company) {
      toast.error("Company name is required");
      return;
    }
    if (!client.contactPerson) {
      toast.error("Party name is required");
      return;
    }
    if (!client.phone) {
      toast.error("Phone number is required");
      return;
    }
   

    if (client.phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    if(!client.whatsapp || client.whatsapp.length !== 10) {
      toast.error("Whatsapp number must be 10 digits");
      return;
    }
    if (id) {
      return;
    } else {
      try {
        let formData = {
          company: client.company,
          name: client.contactPerson,
          phoneNumber: client.phone,
          whatsappNumber: client.whatsapp,
          Address: client.address,
          GSTNumber: client.gstNo,
        };

        const response = await axiosInstance.post(
          "/api/v1/client/create-client",
          formData
        );

        if (response.status === 200) {
          router.push("/client");
          toast.success("Client added successfully!");
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        }
      }
    }
  };

 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-yellow-500 p-6 rounded-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-black text-center">
          {id !== undefined ? "Edit Client" : "Add Client"}
        </h1>
        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block text-black">Company</label>
          <input
            type="text"
            name="company"
            value={client.company}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded bg-white text-black"
            required
          />
          <label className="block text-black">Party Name</label>
          <input
            type="text"
            name="contactPerson"
            value={client.contactPerson}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded bg-white text-black"
            required
          />

          <label className="block text-black">Phone</label>
          <input
            type="number"
            name="phone"
            value={client.phone}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded bg-white text-black"
            required
          />

          <label className="block text-black">WhatsApp</label>
          <input
            type="number"
            name="whatsapp"
            value={client.whatsapp}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded bg-white text-black"
          />

          <label className="block text-black">Address</label>
          <input
            type="text"
            name="address"
            value={client.address}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded bg-white text-black"
          />

          <label className="block text-black">GST No</label>
          <input
            type="text"
            name="gstNo"
            value={client.gstNo}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded bg-white text-black"
          />

          <button
            type="submit"
            className="w-full p-2 bg-black text-white rounded-lg"
          >
            {id !== undefined ? "Update Client" : "Add Client"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddClient;
