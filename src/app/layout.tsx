import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/layout/CartSidebar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Purple Beans — Premium AI-Powered Cinematic Coffee",
  description: "Experience premium sensory coffee, roasted to perfection by Purple Beans Agro Industries Pvt Ltd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F3EE] text-[#1C120D] font-sans selection:bg-[#6B4B7D]/20 selection:text-[#1C120D]">
        <SmoothScrollProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <CartSidebar />
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
