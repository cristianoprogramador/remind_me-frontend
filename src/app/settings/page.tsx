// src/app/settings/page.tsx
"use client";

import React, { useState } from "react";

export default function SettingsPage() {
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("pt-BR");

  const handleDeleteAccount = () => {
    // Lógica para excluir conta
    console.log("Conta excluída.");
  };

  const handleReportProblem = () => {
    window.open("https://www.cristianosilvadev.com.br", "_blank");
  };

  return (
    <div className="flex flex-col justify-center gap-10 items-center h-full">
      <div className="w-[90%] max-w-[400px] bg-gray-200 flex flex-col justify-center items-center border rounded-lg">
        <div className="w-[90%] px-4">
          <div className="text-center py-5 font-semibold text-xl text-gray-800">
            Página de Perfil
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

          {/* Resumo Semanal */}
          <div className="w-full max-w-md mb-6">
            <div className="flex justify-between items-center">
              <label className="text-gray-700">Resumo Semanal</label>
              <input
                type="checkbox"
                checked={weeklySummary}
                onChange={(e) => setWeeklySummary(e.target.checked)}
                className="w-5 h-5"
              />
              <div
                className="ml-2 text-gray-500 cursor-pointer"
                title="Resumo sobre lembretes da próxima semana."
              >
                ℹ️
              </div>
            </div>
          </div>

          {/* Tema */}
          <div className="w-full max-w-md mb-6">
            <label className="text-gray-700">Tema</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full mt-2 p-3 bg-gray-200 rounded-lg"
            >
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
            </select>
          </div>

          {/* Idioma */}
          <div className="w-full max-w-md mb-6">
            <label className="text-gray-700">Idioma</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full mt-2 p-3 bg-gray-200 rounded-lg"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">Inglês (EUA)</option>
            </select>
          </div>

          {/* Gerenciar Assinatura */}
          <div className="w-full max-w-md mb-6">
            <label className="text-gray-700">Gerenciar Assinatura</label>
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
        </div>
      </div>
    </div>
  );
}
