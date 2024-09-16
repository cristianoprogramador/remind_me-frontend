"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import { SearchFriend } from "@/components/searchFriend";
import { Friend, Friendship, UserProps } from "@/types";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function FriendsPage() {
  const { data: session } = useSession();
  const [receivedRequests, setReceivedRequests] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<Friend[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchFriendRequests() {
      if (!session) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/friendship/requests`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(t("friendsPage.fetchFriendRequestsError"));
        }

        const { receivedRequests, sentRequests } = await res.json();

        const mappedReceivedRequests = receivedRequests.map((request: any) => ({
          uuid: request.uuid,
          name: request.user1.name,
          email: request.user1.email,
          profileImageUrl: request.user1.profileImageUrl,
        }));

        const mappedSentRequests = sentRequests.map((request: any) => ({
          uuid: request.uuid,
          name: request.user2.name,
          email: request.user2.email,
          profileImageUrl: request.user2.profileImageUrl,
        }));

        setReceivedRequests(mappedReceivedRequests);
        setSentRequests(mappedSentRequests);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchFriends() {
      if (!session) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/friendship/friends`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(t("friendsPage.fetchFriendsError"));
        }

        const data: Friendship[] = await res.json();

        const friendsList = data.map((friendship) => {
          return friendship.user1.uuid === (session?.user as UserProps).id
            ? friendship.user2
            : friendship.user1;
        });

        setFriends(friendsList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchFriends();
    fetchFriendRequests();
  }, [session]);

  const handleUnfriend = async (friendId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friendship/${friendId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(t("friendsPage.unfriendError"));
      }

      toast.error(t("friendsPage.unfriendSuccess"));

      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.uuid !== friendId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div>{t("friendsPage.loading")}</div>;
  }

  return (
    <div className="flex flex-col justify-center pt-8 gap-10 items-center h-full">
      <div className="w-[90%] max-w-[500px] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-theme-text-color">
          {t("friendsPage.title")}
        </h1>

        <SearchFriend />

        {/* Lista de Amigos */}
        <div className="w-full flex flex-col gap-4 mb-6">
          {friends.map((friend) => (
            <div
              key={friend.uuid}
              className="border border-theme-border-color rounded-md flex flex-col md:flex-row justify-start p-4 items-start bg-white"
            >
              <div className="flex flex-row items-center gap-4 w-full">
                {friend.profileImageUrl ? (
                  <Image
                    src={friend.profileImageUrl}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <FaUser className="w-12 h-12 text-gray-400" />
                )}
                <div>
                  <h2 className="text-lg font-semibold">{friend.name}</h2>
                  <p className="text-gray-600 md:text-base text-sm break-all">
                    {friend.email}
                  </p>
                </div>
                <button
                  className="ml-auto h-10 px-4 bg-gray-200 text-slate-800 transition-all duration-400 ease-in-out transform hover:bg-red-600 hover:text-white rounded-md text-sm"
                  onClick={() => handleUnfriend(friend.uuid)}
                >
                  {t("friendsPage.unfriendButton")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Solicitações de Amizade Recebidas */}

        <div className="w-full flex flex-col gap-4 mb-6">
          {receivedRequests.map((request) => (
            <div key={request.uuid}>
              <h2 className="text-xl font-bold mb-4 text-theme-text-color">
                {t("friendsPage.receivedRequests")}
              </h2>
              <div className="border border-theme-border-color rounded-md p-4 flex justify-between items-center bg-white">
                <div className="flex items-center gap-4">
                  {request.profileImageUrl ? (
                    <Image
                      src={request.profileImageUrl}
                      alt="Profile"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <FaUser className="w-12 h-12 text-gray-400" />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{request.name}</h2>
                    <p className="text-gray-600 md:text-base text-sm break-all">
                      {request.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="h-10 w-24 md:w-32 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={() => handleResponse(request.uuid, true)}
                  >
                    {t("friendsPage.accept")}
                  </button>
                  <button
                    className="h-10 w-24 md:w-32 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => handleResponse(request.uuid, false)}
                  >
                    {t("friendsPage.reject")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Solicitações de Amizade Enviadas */}

        <div className="w-full flex flex-col gap-4 mb-6">
          {sentRequests.map((request) => (
            <div key={request.uuid}>
              <h2 className="text-xl font-bold mb-4 text-theme-text-color">
                {t("friendsPage.sentRequests")}
              </h2>
              <div>
                <div className="border border-theme-border-color rounded-md p-4 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-4">
                    {request.profileImageUrl ? (
                      <Image
                        src={request.profileImageUrl}
                        alt="Profile"
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <FaUser className="w-12 h-12 text-gray-400" />
                    )}
                    <div>
                      <h2 className="text-lg font-semibold">{request.name}</h2>
                      <p className="text-gray-600 md:text-base text-xs break-all">
                        {request.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    {t("friendsPage.awaitingResponse")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  async function handleResponse(requestId: string, accept: boolean) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friendship/respond/${requestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
          },
          body: JSON.stringify({ accept }),
        }
      );

      if (res.ok) {
        const acceptedRequest = receivedRequests.find(
          (request) => request.uuid === requestId
        );
        if (acceptedRequest) {
          setFriends((prevFriends) => [...prevFriends, acceptedRequest]);
        }

        setReceivedRequests((prevRequests) =>
          prevRequests.filter((request) => request.uuid !== requestId)
        );
      } else {
        console.error(t("friendsPage.respondRequestError"));
      }
    } catch (error) {
      console.error(error);
    }
  }
}
