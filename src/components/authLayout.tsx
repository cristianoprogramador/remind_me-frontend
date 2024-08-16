// src/components/AuthLayout.tsx
"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { MainLayout } from "./mainLayout";
import LoadingSpinner from "./loadingSpinner";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (
    // true
    status === "authenticated"
     && session?.user
  ) {
    return <MainLayout>{children}</MainLayout>;
  }

  return <>{children}</>;
};
