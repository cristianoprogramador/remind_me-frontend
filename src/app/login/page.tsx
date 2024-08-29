"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/",
    });
  };

  return (
    <main className="flex min-h-screen w-full justify-between items-center bg-gradient-to-r from-slate-900 to-slate-700">
      <div className="flex flex-row h-full gap-4 items-center justify-center w-full">
        <div className="flex lg:w-1/2 justify-center items-center">
          <div className="p-10 rounded-md sm:border bg-gradient-to-r from-gray-200 to-white">
            <div className="text-center text-2xl lg:text-4xl font-bold">
              Acesse a conta!
            </div>
            <div className="mt-3 text-sm">Seja bem-vindo de volta</div>
            {error && <div className="mt-4 text-red-500">{error}</div>}{" "}
            {/* Exibir mensagem de erro */}
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  placeholder="Digite seu email"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  placeholder="Digite sua senha"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
              >
                Entrar
              </button>
            </form>
            <div className="mt-6 flex items-center justify-between">
              <div className="w-full h-px bg-gray-300"></div>
              <span className="w-full flex text-center items-center justify-center text-sm text-gray-500">
                Entre com
              </span>
              <div className="w-full h-px bg-gray-300"></div>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => signIn("github")}
                className="flex items-center justify-center w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900"
              >
                <FaGithub className="mr-2" />
                GitHub
              </button>

              <button
                type="button"
                onClick={() => signIn("google")}
                className="flex items-center justify-center w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <FaGoogle className="mr-2" />
                Google
              </button>
            </div>
            <div className="flex flex-row gap-3 items-center justify-center md:w-full mt-5">
              <div className="text-sm">Ainda não tem conta?</div>
              <div
                className="text-blue-700 font-semibold text-right text-sm cursor-pointer"
                onClick={() => router.push("/signup")}
              >
                Cadastre-se agora!
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
