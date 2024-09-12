"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SignupPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setErrorMessage(t("signupPage.passwordMismatch"));
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || t("signupPage.registrationError"));
        return;
      }

      const loginResponse = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginResponse?.ok) {
        // Redirecionar para a página inicial após o login bem-sucedido
        router.push("/home");
      } else {
        setErrorMessage(t("signupPage.autoLoginError"));
      }
    } catch (error) {
      setErrorMessage(t("signupPage.registrationError"));
    }
  };

  return (
    <main className="flex min-h-screen w-full justify-between items-center bg-gradient-to-r from-slate-900 to-slate-700">
      <div className="flex flex-row h-full gap-4 items-center justify-center w-full">
        <div className="flex lg:w-1/2 justify-center items-center">
          <div className="p-10 rounded-md sm:border bg-gradient-to-r from-gray-200 to-white">
            <div className="text-center text-2xl lg:text-4xl font-bold">
              {t("signupPage.title")}
            </div>
            <div className="mt-3 text-sm">{t("signupPage.subtitle")}</div>

            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("signupPage.nameLabel")}
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  placeholder={t("signupPage.namePlaceholder")}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("signupPage.emailLabel")}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  placeholder={t("signupPage.emailPlaceholder")}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("signupPage.passwordLabel")}
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  placeholder={t("signupPage.passwordPlaceholder")}
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("signupPage.confirmPasswordLabel")}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  placeholder={t("signupPage.confirmPasswordPlaceholder")}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
              >
                {t("signupPage.signupButton")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
