import { useState } from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { SearchResult, UserProps } from "@/types";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export function SearchFriend() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { t } = useTranslation();

  const handleSearch = async () => {
    setError("");
    setSearchResult(null);
    setIsPending(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friendship/search?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(t("searchFriend.userNotFound"));
      }

      const data: SearchResult = await res.json();
      setSearchResult(data);
    } catch (err) {
      setError(t("searchFriend.error"));
      console.error(err);
    }
  };

  const handleAddFriend = async (userId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friendship/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
          },
          body: JSON.stringify({ friendEmail: email }),
        }
      );

      if (!res.ok) {
        throw new Error(t("searchFriend.requestError"));
      }

      setIsPending(true);
      toast.success(t("searchFriend.success"));
    } catch (error) {
      console.error(t("searchFriend.requestError"), error);
    }
  };

  return (
    <>
      <div className="border border-theme-border-color rounded-md w-full flex flex-col mb-7">
        <div className="flex flex-row items-center justify-center">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent pl-5 py-4 text-theme-text-color outline-none"
            placeholder={t("searchFriend.placeholder")}
          />
          <button
            onClick={handleSearch}
            className="h-10 w-32 bg-gray-200 text-slate-800 transition-all duration-400 ease-in-out transform hover:bg-blue-600 hover:text-white rounded-md mr-4"
          >
            {t("searchFriend.searchButton")}
          </button>
        </div>
      </div>

      <div className="border bg-slate-300 rounded-md w-full flex flex-col mb-4">
        {error && <div className="text-red-500 my-2 text-center">{error}</div>}
        {searchResult && (
          <>
            <h1 className="text-2xl font-bold mt-3 text-center">
              {t("searchFriend.results")}
            </h1>
            <div className="flex items-center gap-4 p-4">
              {searchResult.profileImageUrl ? (
                <Image
                  src={searchResult.profileImageUrl}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <FaUser className="w-12 h-12 text-gray-400" />
              )}
              <div>
                <h2 className="text-lg font-semibold">{searchResult.name}</h2>
                <p className="text-gray-600">{searchResult.email}</p>
              </div>
              {searchResult.status ? (
                <div className="ml-auto text-sm text-gray-600 border border-slate-700 p-1 text-center rounded-lg">
                  {searchResult.status === "PENDING"
                    ? t("searchFriend.pending")
                    : searchResult.status === "ACCEPTED"
                    ? t("searchFriend.accepted")
                    : t("searchFriend.rejected")}
                </div>
              ) : (
                <button
                  onClick={() => handleAddFriend(searchResult.uuid)}
                  className={`ml-auto text-sm h-12 w-32 ${
                    isPending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white rounded-md`}
                  disabled={isPending}
                >
                  {isPending
                    ? t("searchFriend.pending")
                    : t("searchFriend.addFriend")}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
