"use client";

import PhoneInput from "@/components/phoneInput";
import { ToolTip } from "@/components/tooltip";
import { UserProps } from "@/types";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [originalWeeklySummary, setOriginalWeeklySummary] = useState(false);
  const [name, setName] = useState(session?.user?.name!);
  const [originalName, setOriginalName] = useState(session?.user?.name!);
  const [email] = useState(session?.user?.email);
  const [phone, setPhone] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [originalNotificationsEnabled, setOriginalNotificationsEnabled] =
    useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [originalEmailNotifications, setOriginalEmailNotifications] =
    useState(false);
  const [phoneNotifications, setPhoneNotifications] = useState(false);
  const [originalPhoneNotifications, setOriginalPhoneNotifications] =
    useState(false);
  const [notificationExists, setNotificationExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasNameChanged = name !== originalName;
    const hasPhoneChanged = phone !== originalPhone;
    const hasEmailNotificationsChanged =
      emailNotifications !== originalEmailNotifications;
    const hasPhoneNotificationsChanged =
      phoneNotifications !== originalPhoneNotifications;
    const hasNotificationsEnabledChanged =
      notificationsEnabled !== originalNotificationsEnabled;
    const hasWeeklySummaryChanged = weeklySummary !== originalWeeklySummary;

    if (
      !hasNameChanged &&
      !hasPhoneChanged &&
      !hasEmailNotificationsChanged &&
      !hasPhoneNotificationsChanged &&
      !hasNotificationsEnabledChanged &&
      !hasWeeklySummaryChanged
    ) {
      toast.warning(t("profilePage.noChanges"));
      return;
    }

    try {
      if (hasNameChanged) {
        const resName = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/name`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
            },
            body: JSON.stringify({ name }),
          }
        );

        if (!resName.ok) {
          throw new Error(t("profilePage.updateNameFailed"));
        }

        await update({
          user: {
            ...session?.user,
            name: name,
          },
        });

        toast.success(t("profilePage.nameUpdated"));
      }

      if (
        hasPhoneChanged ||
        hasEmailNotificationsChanged ||
        hasPhoneNotificationsChanged ||
        hasNotificationsEnabledChanged ||
        hasWeeklySummaryChanged
      ) {
        const notificationEndpoint = notificationExists
          ? `${process.env.NEXT_PUBLIC_API_URL}/notifications`
          : `${process.env.NEXT_PUBLIC_API_URL}/notifications`;

        const method = notificationExists ? "PUT" : "POST";

        console.log(method);

        const resNotification = await fetch(notificationEndpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
          },
          body: JSON.stringify({
            emailNotify: emailNotifications,
            phoneNotify: phoneNotifications,
            phoneNumber: phone,
            weeklySummary: emailNotifications ? weeklySummary : false,
          }),
        });

        if (!resNotification.ok) {
          throw new Error(t("profilePage.updateNotificationFailed"));
        }

        toast.success(t("profilePage.notificationUpdated"));
      }
    } catch (error) {
      console.error(t("profilePage.updateError"), error);
      toast.error(t("profilePage.updateError"));
    }
  };

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
            },
          }
        );

        const data = await res.json();
        console.log(data);

        if (!data.notificationsEmpty) {
          setNotificationsEnabled(data.emailNotify || data.phoneNotify);
          setEmailNotifications(data.emailNotify);
          setPhoneNotifications(data.phoneNotify);
          setWeeklySummary(data.weeklySummary || false);
          setPhone(data.phoneNumber || "");

          setOriginalNotificationsEnabled(data.emailNotify || data.phoneNotify);
          setOriginalEmailNotifications(data.emailNotify);
          setOriginalPhoneNotifications(data.phoneNotify);
          setOriginalWeeklySummary(data.weeklySummary || false);
          setOriginalPhone(data.phoneNumber || "");

          setNotificationExists(true);
        } else {
          setNotificationExists(false);
        }
      } catch (error) {
        console.error(t("profilePage.fetchNotificationError"), error);
        setNotificationExists(false);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchNotificationSettings();
    }
  }, [session]);

  if (loading) {
    return <div>{t("profilePage.loading")}</div>;
  }

  return (
    <div className="flex flex-col justify-center py-8 gap-10 items-center h-full">
      <div className="w-[90%] max-w-[400px] bg-gray-200 flex flex-col justify-center items-center border rounded-lg">
        <div className="w-[90%] px-4">
          <div className="text-center py-5 font-semibold text-xl text-gray-800">
            {t("profilePage.title")}
          </div>
          <form onSubmit={handleUpdateProfile}>
            <div className="flex flex-col gap-4 py-5">
              <div className="flex flex-row justify-between items-center w-full border border-gray-500 rounded-lg p-4">
                <label className="mb-1 text-gray-700">
                  {t("profilePage.nameLabel")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent p-1 border border-gray-500 rounded-lg"
                />
              </div>

              <div className="flex flex-col w-full border border-gray-500 rounded-lg p-4">
                <label className="mb-1 text-gray-700">
                  {t("profilePage.emailLabel")}
                </label>
                <div className="text-gray-700">{email}</div>
                <div className="flex justify-between items-center mt-2">
                  <label
                    className={`text-sm mr-2 ${
                      notificationsEnabled ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {t("profilePage.emailNotificationsLabel")}
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
                <label className="mb-1 text-gray-700">
                  {t("profilePage.phoneLabel")}
                </label>
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  disabled={!notificationsEnabled}
                />
                <div className="flex justify-between items-center mt-2">
                  <label
                    className={`text-sm mr-2 ${
                      notificationsEnabled ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {t("profilePage.phoneNotificationsLabel")}
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

              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-600 mr-2">
                  {t("profilePage.enableNotificationsLabel")}
                </label>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-5 h-5"
                />
              </div>

              {emailNotifications && (
                <div className="flex justify-between items-center">
                  <div className="flex flex-row items-center gap-2">
                    <label className="text-gray-700">
                      {t("profilePage.weeklySummaryLabel")}
                    </label>
                    <ToolTip
                      content={t("profilePage.weeklySummaryTooltip")}
                      className="text-xs"
                    >
                      <IoIosInformationCircleOutline size={20} color="red" />
                    </ToolTip>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklySummary}
                    onChange={(e) => setWeeklySummary(e.target.checked)}
                    className="w-5 h-5"
                  />
                </div>
              )}

              <button
                type="submit"
                className="px-4 py-2 mt-5 bg-green-500 text-white rounded-md hover:bg-green-700"
              >
                {t("profilePage.updateButton")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
