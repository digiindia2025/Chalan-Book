"use client";
import { useContext } from "react";
import { AuthContext } from "./component/context/AuthContext.js";
import ViewChallan from "./component/challan/challan.js";

import { Toaster } from "./component/ui/toaster";
import { Toaster as Sonner } from "./component/ui/sonner";
import { TooltipProvider } from "./component/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Index from "../pages/Index";


// Initialize QueryClient
const queryClient = new QueryClient();



export default function Home() {
  const { token } = useContext(AuthContext);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* ✅ ViewChallan is shown first, but without "add-chalan/page.js" */}
        <div className="flex flex-1 justify-center bg-white">
          {token && <ViewChallan />}
        </div>

        <Toaster />
        <Sonner />

        
      </TooltipProvider>
    </QueryClientProvider>
  );
}