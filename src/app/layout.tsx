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

import { Providers } from "@/components/providers";
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Linkza",
  description: "A modular, grid-based Bento dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <div className="fixed bottom-4 left-4 z-50">
            <ModeToggle />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
