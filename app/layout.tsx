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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Lo Spacca Dadi | Giochi da tavolo",
    template: "%s | Lo Spacca Dadi",
  },

  description:
    "Recensioni, tutorial, unboxing, notizie e campagne crowdfunding dedicate al mondo dei giochi da tavolo.",

  keywords: [
    "giochi da tavolo",
    "recensioni giochi da tavolo",
    "tutorial giochi da tavolo",
    "unboxing giochi da tavolo",
    "notizie giochi da tavolo",
    "crowdfunding giochi da tavolo",
    "board game",
    "Lo Spacca Dadi",
  ],

  authors: [
    {
      name: "Lo Spacca Dadi",
    },
  ],

  creator: "Lo Spacca Dadi",
  publisher: "Lo Spacca Dadi",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "/",
    siteName: "Lo Spacca Dadi",
    title: "Lo Spacca Dadi | Giochi da tavolo",
    description:
      "Recensioni, tutorial, unboxing, notizie e campagne crowdfunding dedicate al mondo dei giochi da tavolo.",
    images: [
      {
        url: "/images/banner-youtube.png",
        width: 2560,
        height: 1440,
        alt: "Lo Spacca Dadi",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Lo Spacca Dadi | Giochi da tavolo",
    description:
      "Recensioni, tutorial, unboxing, notizie e crowdfunding sui giochi da tavolo.",
    images: ["/images/banner-youtube.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
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