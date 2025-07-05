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
  keywords: ["image converter", "webp", "image optimization", "web performance", "image to webp", "image to webp converter", "image to webp converter online", "image to webp converter free", "image to webp converter tool", "image to webp converter website", "image to webp converter app", "image to webp converter online", "image to webp converter free", "image to webp converter tool", "image to webp converter website", "image to webp converter app"],
  authors: [{ name: "Revan Pratama", url: "https://revanpratamas.com" }],
  creator: "Revan Pratama",
  openGraph: {
    title: "Image to WebP Converter",
    description: "Convert your images to WebP format for better web performance",
    url: "https://image-to-webp.revanpratamas.com",
    siteName: "Image to WebP Converter",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Image to WebP Converter",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to WebP Converter",
    description: "Convert your images to WebP format for better web performance",
    site: "@musuhphp",
    creator: "@musuhphp",
    images: ['/og-image.png'],
  },
  category: "technology",
  applicationName: "Image to WebP Converter",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
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
