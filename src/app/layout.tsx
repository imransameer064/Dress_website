import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { StoreProvider } from "@/lib/store-context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CartDrawer from "@/components/cart/CartDrawer";
import AIChat from "@/components/ai/AIChat";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Elegance Pakistan | Premium Women's Fashion",
    template: "%s | Elegance Pakistan",
  },
  description:
    "Discover Pakistan's finest women's clothing collection. Shop premium lawn suits, bridal wear, luxury pret, party wear, and more with fast delivery across Pakistan.",
  keywords: [
    "Pakistani women clothing",
    "lawn suits Pakistan",
    "bridal wear Pakistan",
    "shalwar kameez",
    "Pakistani fashion",
    "online shopping Pakistan",
    "kurti",
    "luxury pret",
  ],
  openGraph: {
    title: "Elegance Pakistan | Premium Women's Fashion",
    description: "Discover Pakistan's finest women's clothing collection.",
    type: "website",
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elegance Pakistan | Premium Women's Fashion",
    description: "Discover Pakistan's finest women's clothing collection.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-white antialiased">
        <StoreProvider>
          <Suspense fallback={<div className="h-20 bg-white" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <CartDrawer />
          <Suspense fallback={null}>
            <AIChat />
          </Suspense>
        </StoreProvider>
      </body>
    </html>
  );
}
