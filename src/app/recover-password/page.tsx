"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function RecoverPasswordPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error(t("recoverPassword.passwordsDoNotMatch"));
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      if (res.ok) {
        toast.success(t("recoverPassword.passwordResetSuccess"));
        router.push("/login");
      } else {
        const data = await res.json();
        toast.error(data.message || t("recoverPassword.errorResetPassword"));
      }
    } catch (error) {
      console.error("Erro ao redefinir a senha:", error);
      toast.error(t("recoverPassword.errorResetPassword"));
    }
  };

  if (!token) {
    toast.error(t("recoverPassword.invalidToken"));
    router.push("/login");
    return null;
  }

  return (
    <main className="relative flex min-h-screen w-full justify-between items-center bg-gradient-to-r from-slate-900 to-slate-700">
      <div className="flex flex-row h-full gap-4 items-center justify-center w-full">
        <div className="p-6 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4">
            {t("recoverPassword.title")}
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("recoverPassword.newPassword")}
              required
              className="p-2 border mb-3"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("recoverPassword.confirmPassword")}
              required
              className="p-2 border mb-3"
            />
            <button
              type="submit"
              className="cursor-pointer mt-2 font-semibold rounded-lg text-base text-center bg-blue-600 text-white hover:opacity-80 py-2"
            >
              {t("recoverPassword.resetPasswordButton")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
