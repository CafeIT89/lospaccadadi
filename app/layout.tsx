import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Lo Spacca Dadi",
  description:
    "News, crowdfunding e intelligenza artificiale per il mondo dei giochi da tavolo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="it"
      className={`${anton.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white font-[family-name:var(--font-body)]">
         <Navbar />
        {children}
          <Footer />
      </body>
    </html>
  );
}