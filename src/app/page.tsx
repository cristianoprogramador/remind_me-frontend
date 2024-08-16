// src/app/page.tsx
"use client";

import { useSession } from "next-auth/react";
import LoginPage from "./login/page";
import HomePage from "./home/page";
import LoadingSpinner from "@/components/loadingSpinner";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (
    // true
    status === "authenticated"
     && session?.user
  ) {
    return <HomePage />;
  }

  return <LoginPage />;
}
