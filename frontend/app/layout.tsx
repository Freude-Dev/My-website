import type { Metadata } from "next";
import "./globals.css";
import PageTransition from "./components/pageTransition";
import localFont from 'next/font/local'
import NavbarWrapper from "./components/NavbarWrapper";

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
  title: "Freude Dev",
  icons: {
    icon: "/icons/icon.png",
  },
  description: "Efficient Services at your disposal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${tommy.variable} font-sans antialiased bg-black text-white`}>
        {/* Navbar Container */}
        <div className="flex justify-center items-center p-4 absolute top-0 w-full z-50">
          <NavbarWrapper />
        </div>
        {/* Animated Content Area */}
        <main className="min-h-full">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}