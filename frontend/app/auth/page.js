"use client";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../util/axiosInstance"
import toast from "react-hot-toast";
import { AuthContext } from "../component/context/AuthContext";

const Auth = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/api/v1/auth/login", formData);

      if (response.status === 200) {
        login(response.data.token, response.data.email);
        router.push("/");
        toast.success("Login successful!");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center">
      <div className="flex rounded-lg justify-center items-center bg-black shadow-md p-6">
        <div>
          <form onSubmit={handleLogin}>
            <div className="text-yellow-300 text-3xl font-semibold flex mb-4 justify-center">
              <h2>Login</h2>
            </div>

            <label className="text-white">Email:</label>
            <input
              type="email"
              className="input w-[400px] block mt-2 p-2 border rounded-md"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label className="text-white mt-4">Password:</label>
            <input
              type="password"
              className="input w-[400px] block mt-2 p-2 border rounded-md"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="btn btn-primary mt-6 w-full text-lg p-2 bg-yellow-300 text-black font-bold rounded-md"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
