import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import OverlayScrollbar from "@/components/OverlayScrollbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TAI - Operations Dashboard",
  description: "AI-powered operations and TAC analytics dashboard",
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
    <html lang="en" className={`${poppins.variable} h-full`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <OverlayScrollbar />
        {children}
      </body>
    </html>
  );
}
