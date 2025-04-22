"use client";
import { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname(); // Get current route path
  const { token, setToken, email, setEmail } = useContext(AuthContext); // Assuming you have an AuthContext to manage authentication state
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      setToken(false);
      setEmail(null);
      router.push("/auth");
      toast.success("Logout successful!");
    }
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-900 text-white p-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold">Dashboard</h1>

        {/* Navigation Menu */}
        <ul className="flex space-x-4">
          {[
            { name: "View Challan", path: "/" },
            { name: "Add Challan", path: "/challan/add-challan" },
            { name: "View Client", path: "/client" },
            { name: "Add Client", path: "/client/add-client" },
          ].map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`px-4 py-2 rounded-full border-2 transition ${
                  pathname === item.path
                    ? "bg-red-500 border-red-500 text-white"
                    : "border-gray-500 text-gray-300 hover:bg-gray-700 hover:border-gray-400"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition"
          >
            Profile
          </button>

          {dropdownOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg overflow-hidden">
              <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
               {email}
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 transition text-left"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
