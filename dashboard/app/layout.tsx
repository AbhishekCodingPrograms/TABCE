import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TABCE Creative Studio",
  description: "Tesco AI Beauty Try-On Engine",
};

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen selection:bg-blue-500/30`}
      >
        <div className="animated-bg" />
        <div className="fixed inset-0 z-[-1] bg-grid-white pointer-events-none"></div>
        <Header />
        <div className="pt-16 min-h-screen">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
