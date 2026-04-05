import type { Metadata } from "next";
import "./globals.css";
// import PageTransition from "./components/PageTransition";
import localFont from 'next/font/local'
import { Analytics } from "@vercel/analytics/next"
import NavbarWrapper from "./components/NavbarWrapper";
import SPALayout from "./components/SPALayout";
import { LanguageProvider } from "./components/LanguageProvider";
import CursorTrail from "./components/CursorTrail";

const tommy = localFont({
  src: [
    { path: '/fonts/TOMMY_Thin.otf', weight: '100' },
    { path: '/fonts/TOMMY_Light.otf', weight: '300' },
    { path: '/fonts/TOMMY_Regular.otf', weight: '400' },
    { path: '/fonts/TOMMY_Medium.otf', weight: '500' },
    { path: '/fonts/TOMMY_Bold.otf', weight: '700' },
    { path: '/fonts/TOMMY_ExtraBold.otf', weight: '800' },
    { path: '/fonts/TOMMY_Black.otf', weight: '900' },
  ],
  variable: '--font-tommy',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL("https://my-website-y7bm.vercel.app"),
  title: {
    default: "Freude Dev | Efficient Services at your disposal",
    template: "%s | Freude Dev",
  },
  description: "Freude Dev offers efficient digital services, IT solutions, and web development to help your business grow.",
  keywords: ["Web Development", "IT Solutions", "Networking", "Digital Services", "Freude Dev"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Freude Dev | Efficient Services",
    description: "Efficient digital services, web development, and IT solutions tailored for your business.",
    url: "https://my-website-y7bm.vercel.app",
    siteName: "Freude Dev",
    images: [
      {
        url: "/icons/icon.png",
        width: 800,
        height: 600,
        alt: "Freude Dev Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freude Dev | Efficient Services",
    description: "Efficient digital services, web development, and IT solutions tailored for your business.",
    images: ["/icons/icon.png"],
  },
  icons: {
    icon: "/icons/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${tommy.variable} font-sans antialiased bg-black text-white`}>
        <LanguageProvider>
          <CursorTrail />
          {/* Navbar Container */}
          <div className="flex justify-center items-center p-4 absolute top-0 w-full z-50">
            <NavbarWrapper />
          </div>
          {/* SPA Layout */}
          <SPALayout />
          {/* Animated Content Area - for admin routes */}
          <main className="min-h-full" style={{ display: 'none' }}>
            <PageTransition>{children}</PageTransition>
          </main>
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}