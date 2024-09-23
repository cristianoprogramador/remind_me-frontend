"use client";

import React, { ReactNode } from "react";
import { CgProfile } from "react-icons/cg";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { TfiWrite } from "react-icons/tfi";
import { LuSettings } from "react-icons/lu";
import { MdManageSearch, MdOutlineWbSunny } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import { FaUserFriends } from "react-icons/fa";
import { useTheme } from "@/app/theme-context";
import { GoMoon } from "react-icons/go";
import { useTranslation } from "react-i18next";
import { AiOutlineBug } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { useLanguage } from "@/context/i18nContext";

interface MainLayoutProps {
  children: ReactNode;
}

interface MenuItemProps {
  path?: string;
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      signOut({ callbackUrl: "/login" });
    }
  };

  const MenuItemSidebar: React.FC<MenuItemProps> = ({
    path,
    title,
    icon,
    onClick,
  }) => {
    const router = useRouter();
    const pathname = usePathname();
    const isActive = pathname === path;

    return (
      <li
        title={title}
        className={`p-4 cursor-pointer flex flex-row items-center justify-center lg:justify-start gap-3 transition-all duration-400 ease-in-out transform hover:bg-slate-700 hover:text-white rounded-l-xl ${
          isActive && "bg-slate-800 text-white"
        }`}
        onClick={onClick || (() => router.push(path || "/"))}
      >
        {icon}
        <p className="hidden lg:flex">{title}</p>
      </li>
    );
  };

  const MenuItemHeader: React.FC<MenuItemProps> = ({
    path,
    title,
    icon,
    onClick,
  }) => {
    const router = useRouter();
    const pathname = usePathname();
    const isActive = pathname === path;

    return (
      <div
        title={title}
        className={`p-4 cursor-pointer flex flex-row items-center gap-3 transition-all duration-400 ease-in-out transform hover:bg-slate-700 rounded-b-lg mb-1 ${
          isActive && "bg-slate-900 text-white"
        }`}
        onClick={onClick || (() => router.push(path || "/"))}
      >
        {icon}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen flex justify-center transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-r from-slate-900 to-slate-800"
          : "bg-white"
      }`}
    >
      <div className="w-full max-w-[1050px] flex">
        <aside
          className={`md:w-20 lg:w-64 md:flex hidden flex-col border-r-[1px] border-gray-700 ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          <div className="flex flex-row gap-2 justify-center items-center mt-7">
            <Image src={"/logo.png"} alt="logo" width={40} height={100} />
            <div className="p-5 text-xl font-semibold select-none hidden lg:flex">
              {t("mainLayout.title")}
            </div>
          </div>
          <ul className="mt-8">
            <MenuItemSidebar
              path="/"
              title={t("mainLayout.home")}
              icon={<TfiWrite size={20} />}
            />
            <MenuItemSidebar
              path="/search"
              title={t("mainLayout.search")}
              icon={<MdManageSearch size={20} />}
            />
            <MenuItemSidebar
              path="/profile"
              title={t("mainLayout.profile")}
              icon={<CgProfile size={20} />}
            />
            <MenuItemSidebar
              path="/friends"
              title={t("mainLayout.friends")}
              icon={<FaUserFriends size={20} />}
            />
            {userRole === "admin" && (
              <>
                <MenuItemSidebar
                  path="/error-logs"
                  title={t("mainLayout.errorLogs")}
                  icon={<AiOutlineBug size={20} />}
                />
                <MenuItemSidebar
                  path="/users"
                  title={t("mainLayout.users")}
                  icon={<FiUsers size={20} />}
                />
              </>
            )}
            <MenuItemSidebar
              path="/settings"
              title={t("mainLayout.settings")}
              icon={<LuSettings size={20} />}
            />
            <MenuItemSidebar
              title={t("mainLayout.logout")}
              icon={<FiLogOut size={20} />}
              onClick={handleLogout}
            />
          </ul>
          <div className="flex flex-row gap-4 justify-center mt-auto mb-4">
            {theme === "light" ? (
              <GoMoon
                size={20}
                onClick={toggleTheme}
                className="cursor-pointer"
                color="black"
              />
            ) : (
              <MdOutlineWbSunny
                size={20}
                onClick={toggleTheme}
                className="cursor-pointer"
                color="white"
              />
            )}
            <div className="flex flex-row gap-2">
              <Image
                src={"/flagbrazil.svg"}
                alt="PT"
                width={20}
                height={20}
                className={`cursor-pointer ${
                  language === "pt-BR"
                    ? "border rounded px-[2px] border-blue-500"
                    : ""
                }`}
                onClick={() => changeLanguage("pt-BR")}
              />
              <Image
                src={"/flagEUA.svg"}
                alt="EN"
                width={20}
                height={20}
                className={`cursor-pointer ${
                  language === "en-US"
                    ? "border rounded px-[2px] border-blue-500"
                    : ""
                }`}
                onClick={() => changeLanguage("en-US")}
              />
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col ">
          <div
            className={`md:hidden flex flex-row justify-around border-b ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            <MenuItemHeader
              path="/"
              title={t("mainLayout.home")}
              icon={<TfiWrite size={20} />}
            />
            <MenuItemHeader
              path="/search"
              title={t("mainLayout.search")}
              icon={<MdManageSearch size={20} />}
            />
            <MenuItemHeader
              path="/profile"
              title={t("mainLayout.profile")}
              icon={<CgProfile size={20} />}
            />
            <MenuItemHeader
              path="/friends"
              title={t("mainLayout.friends")}
              icon={<FaUserFriends size={20} />}
            />
            {userRole === "admin" && (
              <>
                <MenuItemHeader
                  path="/error-logs"
                  title={t("mainLayout.errorLogs")}
                  icon={<AiOutlineBug size={20} />}
                />
                <MenuItemHeader
                  path="/users"
                  title={t("mainLayout.users")}
                  icon={<FiUsers size={20} />}
                />
              </>
            )}
            <MenuItemHeader
              path="/settings"
              title={t("mainLayout.settings")}
              icon={<LuSettings size={20} />}
            />
            <MenuItemHeader
              title={t("mainLayout.logout")}
              icon={<FiLogOut size={20} />}
              onClick={handleLogout}
            />
          </div>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};
