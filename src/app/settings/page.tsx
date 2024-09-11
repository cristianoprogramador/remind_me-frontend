// src/app/settings/page.tsx
"use client";

import { ToolTip } from "@/components/tooltip";
import { UserProps } from "@/types";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import { useTheme } from "../theme-context";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState("pt-BR");
  const { data: session } = useSession();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (!session) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${
          (session.user as UserProps).id
        }`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Falha ao excluir o usuário");
      }

      toast.success("Conta excluída com sucesso.");

      signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir conta.");
    }
  };

  const handleReportProblem = () => {
    window.open("https://www.cristianosilvadev.com", "_blank");
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value;
    if (selectedTheme !== theme) {
      toggleTheme();
    }
  };

  return (
    <div className="flex flex-col justify-center py-8 gap-10 items-center h-full">
      <div className="w-[90%] max-w-[440px] bg-gray-200 flex flex-col justify-center items-center border rounded-lg">
        <div className="w-[90%] px-4">
          <div className="text-center py-5 font-semibold text-xl text-gray-800">
            Configurações
          </div>

          {/* Tema */}
          <div className="w-full max-w-md mb-6 flex flex-row items-center justify-between gap-3">
            <label className="text-gray-700">Tema</label>
            <select
              onChange={handleThemeChange}
              value={theme}
              className="mt-2 p-3 bg-gray-300 rounded-lg"
            >
              <option value="light">Modo Claro</option>
              <option value="dark">Modo Escuro</option>
            </select>
          </div>

          {/* Idioma */}
          <div className="w-full max-w-md mb-6 flex flex-row items-center justify-between gap-3">
            <label className="text-gray-700">Idioma</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-2 p-3 bg-gray-300 rounded-lg"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">Inglês (EUA)</option>
            </select>
          </div>

          {/* Gerenciar Assinatura */}
          <div className="w-full max-w-md mb-6 flex flex-row items-center justify-center gap-3">
            <label className="text-gray-700 whitespace-nowrap w-full text-start">
              Gerenciar Assinatura
            </label>
            <button
              className="w-full mt-2 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed"
              disabled
            >
              Em Breve
            </button>
          </div>

          {/* Reportar Problema */}
          <div className="w-full max-w-md mb-6">
            <button
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              onClick={handleReportProblem}
            >
              Reportar Problema
            </button>
          </div>

          {/* Excluir Conta */}
          <div className="w-full max-w-md mb-6">
            <button
              className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-700"
              onClick={handleDeleteAccount}
            >
              Excluir Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
