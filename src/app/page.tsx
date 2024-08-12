// src/app/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoginPage from "./login/page";
import HomePage from "./home/page";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (
    status !== "authenticated"
    // && session?.user
  ) {
    // Usuário está autenticado, exibe a Home
    return <HomePage />;
  }

  return <LoginPage />;
}
