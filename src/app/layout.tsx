// src\app\layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "./SessionProviderWrapper";
import { AuthLayout } from "@/components/authLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Remind Me",
  description: "A website that reminds you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <AuthLayout>{children}</AuthLayout>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
