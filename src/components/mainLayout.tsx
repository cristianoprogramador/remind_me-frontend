"use client";

import React, { ReactNode } from "react";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { TfiWrite } from "react-icons/tfi";
import { LuCalendarClock, LuSettings } from "react-icons/lu";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 md:flex flex-col hidden bg-gradient-to-r from-slate-900 to-slate-800 border-r-[1px] border-gray-700 text-white">
        <div className="flex flex-row gap-2 justify-center items-center mt-7">
          <Image src={"/logo.png"} alt="logo" width={40} height={100} />
          <div className="p-5 text-xl font-semibold select-none">Remind-Me</div>
        </div>
        <ul className="mt-8">
          <li
            className={`p-4 cursor-pointer flex flex-row items-center gap-3 transition-all duration-400 ease-in-out transform hover:bg-slate-700 ${
              isActive("/") && "bg-slate-800"
            }`}
            onClick={() => navigate("/")}
          >
            <TfiWrite size={20} />
            Página Inicial
          </li>
          <li
            className={`p-4 cursor-pointer flex flex-row items-center gap-3 transition-all duration-400 ease-in-out transform hover:bg-slate-700 ${
              isActive("/incoming") && "bg-slate-800"
            }`}
            onClick={() => navigate("/incoming")}
          >
            <LuCalendarClock size={20} />
            Próximos Avisos
          </li>

          <li
            className={`p-4 cursor-pointer flex flex-row items-center gap-3 transition-all duration-400 ease-in-out transform hover:bg-slate-700 ${
              isActive("/profile") && "bg-slate-800"
            }`}
            onClick={() => navigate("/profile")}
          >
            <CgProfile size={20} />
            Perfil
          </li>
          <li
            className={`p-4 cursor-pointer flex flex-row items-center gap-3 transition-all duration-400 ease-in-out transform hover:bg-slate-700 ${
              isActive("/settings") && "bg-slate-800"
            }`}
            onClick={() => navigate("/settings")}
          >
            <LuSettings size={20} />
            Configurações
          </li>
        </ul>
      </div>

      <div className="flex-1 flex flex-col bg-gradient-to-r from-slate-800 to-slate-900">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
