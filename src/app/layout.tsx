import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Image to WebP Converter | Revan Pratama",
  description: "Convert your images to WebP format for better web performance. Fast, secure, and easy to use.",
  keywords: "image converter, webp, image optimization, web performance",
  authors: [{ name: "Revan Pratama", url: "https://revanpratamas.com" }],
  creator: "Revan Pratama",
  openGraph: {
    title: "Image to WebP Converter",
    description: "Convert your images to WebP format for better web performance",
    url: "https://image-to-webp.revanpratamas.com",
    siteName: "Image to WebP Converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to WebP Converter",
    description: "Convert your images to WebP format for better web performance",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-white text-black antialiased`}>
        {children}
      </body>
    </html>
  );
}
