"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./component/header/page";
import { Toaster } from "react-hot-toast";
import { AuthContext, AuthProvider } from "./component/context/AuthContext.js";
import { useContext, useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ContentWrapper>{children}</ContentWrapper>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

// ✅ Prevents Hydration Issues by Ensuring Client-Safe Content
const ContentWrapper = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || loading) return null;

  return (
    <>
      {token && <Header />}
      {children}
    </>
  );
};
