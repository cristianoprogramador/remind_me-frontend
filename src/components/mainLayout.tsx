"use client";

import React, { ReactNode } from "react";
import { CgProfile } from "react-icons/cg";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { TfiWrite } from "react-icons/tfi";
import { LuSettings } from "react-icons/lu";
import { MdManageSearch } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { FaUserFriends } from "react-icons/fa";

interface MainLayoutProps {
  children: ReactNode;
}

interface MenuItemProps {
  path?: string;
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ path, title, icon, onClick }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <li
      title={title}
      className={`p-4 cursor-pointer flex flex-row items-center justify-center lg:justify-start gap-3 transition-all duration-400 ease-in-out transform hover:bg-slate-700 ${
        isActive && "bg-slate-800"
      }`}
      onClick={onClick || (() => router.push(path || "/"))}
    >
      {icon}
      <p className="hidden lg:flex">{title}</p>
    </li>
  );
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      signOut({ callbackUrl: "/login" });
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="w-20 lg:w-64 flex flex-col bg-gradient-to-r from-slate-900 to-slate-800 border-r-[1px] border-gray-700 text-white">
        <div className="flex flex-row gap-2 justify-center items-center mt-7">
          <Image src={"/logo.png"} alt="logo" width={40} height={100} />
          <div className="p-5 text-xl font-semibold select-none hidden lg:flex">
            Remind-Me
          </div>
        </div>
        <ul className="mt-8">
          <MenuItem
            path="/"
            title="Página Inicial"
            icon={<TfiWrite size={20} />}
          />
          <MenuItem
            path="/search"
            title="Buscar"
            icon={<MdManageSearch size={20} />}
          />
          <MenuItem
            path="/profile"
            title="Perfil"
            icon={<CgProfile size={20} />}
          />
          <MenuItem
            path="/friends"
            title="Amigos"
            icon={<FaUserFriends size={20} />}
          />
          <MenuItem
            path="/settings"
            title="Configurações"
            icon={<LuSettings size={20} />}
          />
          <MenuItem
            title="Logout"
            icon={<FiLogOut size={20} />}
            onClick={handleLogout}
          />
        </ul>
      </aside>

      <div className="flex-1 flex flex-col bg-gradient-to-r from-slate-800 to-slate-900">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
