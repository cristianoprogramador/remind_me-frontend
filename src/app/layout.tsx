// src\app\layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "./SessionProviderWrapper";
import { AuthLayout } from "@/components/authLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./theme-context";
import { LanguageProvider } from "@/context/i18nContext";

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
        <ThemeProvider>
          <LanguageProvider>
            <SessionProviderWrapper>
              <AuthLayout>
                {children}
                <ToastContainer />
              </AuthLayout>
            </SessionProviderWrapper>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
