"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaUser } from "react-icons/fa";

// Tipagem para as solicitações de amizade
interface FriendRequest {
  id: string;
  user1: {
    name: string;
    email: string;
    profileImageUrl?: string;
  };
}

// Tipagem para a sessão
interface UserProps {
  id: string;
  token: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function FriendsPage() {
  const { data: session } = useSession();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
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

        const data: FriendRequest[] = await res.json();
        setFriendRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchFriendRequests();
  }, [session]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col justify-start items-center p-8 w-full">
      <div className="max-w-[720px] w-[80%] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-white">Amigos</h1>
        <div className="border rounded-md w-full flex flex-col mb-7">
          <div className="flex flex-row items-center justify-center">
            <input
              type="text"
              className="w-full bg-transparent pl-5 py-4 text-white outline-none"
              placeholder="Digite o e-mail do amigo..."
            />
            <button className="h-10 w-32 bg-gray-200 text-slate-800 transition-all duration-400 ease-in-out transform hover:bg-blue-600 hover:text-white rounded-md mr-4">
              Buscar
            </button>
          </div>
        </div>

        {/* Lista de Solicitações de Amizade */}
        <div className="w-full flex flex-col gap-4">
          {friendRequests.map((request) => (
            <div
              key={request.id}
              className="border rounded-md p-4 flex justify-between items-center bg-white"
            >
              <div className="flex items-center gap-4">
                {request.user1.profileImageUrl ? (
                  <Image
                    src={request.user1.profileImageUrl}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <FaUser className="w-12 h-12 text-gray-400" />
                )}
                <div>
                  <h2 className="text-lg font-semibold">
                    {request.user1.name}
                  </h2>
                  <p className="text-gray-600">{request.user1.email}</p>
                </div>
              </div>
              <button
                className="h-10 w-32 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={() => handleAccept(request.id)}
              >
                Aceitar
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );

  async function handleAccept(requestId: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friendship/respond/${requestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
          },
          body: JSON.stringify({ accept: true }),
        }
      );

      if (res.ok) {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
      } else {
        console.error("Failed to accept friend request");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
