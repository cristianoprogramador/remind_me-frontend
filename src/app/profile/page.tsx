"use client";

import { useSession } from "next-auth/react";
import React, { useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name!);
  const [email] = useState(session?.user?.email);
  const [phone, setPhone] = useState("(19) 99252-5256");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [phoneNotifications, setPhoneNotifications] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Perfil atualizado:", {
      name,
      phone,
      notificationsEnabled,
      emailNotifications,
      phoneNotifications,
    });
  };

  return (
    <div className="flex flex-col justify-center gap-10 items-center h-full">
      <div className="w-[90%] max-w-[400px] bg-gray-200 flex flex-col justify-center items-center border rounded-lg">
        <div className="w-[90%] px-4">
          <div className="text-center py-5 font-semibold text-xl text-gray-800">
            Página de Perfil
          </div>
          <form onSubmit={handleUpdateProfile}>
            <div className="flex flex-col gap-4 py-5">
              <div className="flex flex-col w-full border border-gray-500 rounded-lg p-4">
                <label className="mb-1 text-gray-700">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent outline-none"
                />
              </div>

              <div className="flex flex-col w-full border border-gray-500 rounded-lg p-4">
                <label className="mb-1 text-gray-700">E-mail</label>
                <div className="text-gray-700">{email}</div>
                <div className="flex items-center mt-2">
                  <label
                    className={`text-sm mr-2 ${
                      notificationsEnabled ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Notificações por e-mail
                  </label>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    disabled={!notificationsEnabled}
                    className="w-5 h-5"
                  />
                </div>
              </div>

              <div className="flex flex-col w-full border border-gray-500 rounded-lg p-4">
                <label className="mb-1 text-gray-700">Telefone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent outline-none"
                />
                <div className="flex items-center mt-2">
                  <label
                    className={`text-sm mr-2 ${
                      notificationsEnabled ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Notificações por SMS
                  </label>
                  <input
                    type="checkbox"
                    checked={phoneNotifications}
                    onChange={(e) => setPhoneNotifications(e.target.checked)}
                    disabled={!notificationsEnabled}
                    className="w-5 h-5"
                  />
                </div>
              </div>

              <div className="flex items-center mt-4">
                <label className="text-sm text-gray-600 mr-2">
                  Ativar Notificações
                </label>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-5 h-5"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 mt-5 bg-green-500 text-white rounded-md hover:bg-green-700"
              >
                Atualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
