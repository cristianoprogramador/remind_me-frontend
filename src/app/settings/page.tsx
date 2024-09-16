"use client";

import { UserProps } from "@/types";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { useTheme } from "../theme-context";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/i18nContext";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

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
        throw new Error(t("settingsPage.deleteAccountError"));
      }

      toast.success(t("settingsPage.deleteAccountSuccess"));

      signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      console.error(t("settingsPage.deleteAccountError"), error);
      toast.error(t("settingsPage.deleteAccountError"));
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
            {t("settingsPage.title")}
          </div>

          <div className="w-full max-w-md mb-6 flex flex-row items-center justify-between gap-3">
            <label className="text-gray-700">
              {t("settingsPage.themeLabel")}
            </label>
            <select
              onChange={handleThemeChange}
              value={theme}
              className="mt-2 p-3 bg-gray-300 rounded-lg"
            >
              <option value="light">{t("settingsPage.lightMode")}</option>
              <option value="dark">{t("settingsPage.darkMode")}</option>
            </select>
          </div>

          <div className="w-full max-w-md mb-6 flex flex-row items-center justify-between gap-3">
            <label className="text-gray-700">
              {t("settingsPage.languageLabel")}
            </label>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="mt-2 p-3 bg-gray-300 rounded-lg"
            >
              <option value="pt-BR">{t("settingsPage.portuguese")}</option>
              <option value="en-US">{t("settingsPage.english")}</option>
            </select>
          </div>

          <div className="w-full max-w-md mb-6 flex flex-row items-center justify-center gap-3">
            <label className="text-gray-700 whitespace-nowrap w-full text-start">
              {t("settingsPage.manageSubscription")}
            </label>
            <button
              className="w-full mt-2 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed"
              disabled
            >
              {t("settingsPage.comingSoon")}
            </button>
          </div>

          <div className="w-full max-w-md mb-6">
            <button
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              onClick={handleReportProblem}
            >
              {t("settingsPage.reportProblem")}
            </button>
          </div>

          <div className="w-full max-w-md mb-6">
            <button
              className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-700"
              onClick={handleDeleteAccount}
            >
              {t("settingsPage.deleteAccount")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
