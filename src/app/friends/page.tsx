"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import { SearchFriend } from "@/components/searchFriend";
import { Friend, Friendship, UserProps } from "@/types";

export default function FriendsPage() {
  const { data: session } = useSession();
  const [receivedRequests, setReceivedRequests] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<Friend[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

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
          throw new Error("Failed to fetch friend requests");
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
          throw new Error("Failed to fetch friends");
        }

        const data: Friendship[] = await res.json();

        // Filtra e mapeia os amigos, excluindo o usuário logado
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col justify-start items-center p-8 w-full">
      <div className="max-w-[720px] w-[80%] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-white">Amigos</h1>

        <SearchFriend />

        {/* Lista de Amigos */}
        <div className="w-full flex flex-col gap-4 mb-6">
          {friends.map((friend) => (
            <div
              key={friend.uuid}
              className="border rounded-md p-4 flex items-center bg-white"
            >
              <div className="flex items-center gap-4">
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
                  <p className="text-gray-600">{friend.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Solicitações de Amizade Recebidas */}

        <div className="w-full flex flex-col gap-4 mb-6">
          {receivedRequests.map((request) => (
            <div key={request.uuid}>
              <h2 className="text-xl font-bold mb-4 text-white">
                Solicitações de Amizade Recebidas
              </h2>
              <div className="border rounded-md p-4 flex justify-between items-center bg-white">
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
                    <p className="text-gray-600">{request.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="h-10 w-32 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={() => handleResponse(request.uuid, true)}
                  >
                    Aceitar
                  </button>
                  <button
                    className="h-10 w-32 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => handleResponse(request.uuid, false)}
                  >
                    Rejeitar
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
              <h2 className="text-xl font-bold mb-4 text-white">
                Solicitações de Amizade Enviadas
              </h2>

              <div className="border rounded-md p-4 flex justify-between items-center bg-white">
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
                    <p className="text-gray-600">{request.email}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Aguardando resposta...
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
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
        console.error("Failed to respond to friend request");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
