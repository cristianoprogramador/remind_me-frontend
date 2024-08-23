// src\app\search\page.tsx

"use client";

import RemindList from "@/components/Remind/remindList";
import { SearchRemind } from "@/components/Remind/searchRemind";
import { Annotation, UserProps } from "@/types";
import { annotations } from "@/utils/mockData";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const { data: session } = useSession();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnotations() {
      if (!session) return;

      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/annotations/user?onlyFuture=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch annotations");
        }

        const data: Annotation[] = await res.json();
        setAnnotations(data);
      } catch (error) {
        console.error("Error fetching annotations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnnotations();
  }, [session]);

  return (
    <main className="flex flex-col justify-start items-center p-8 w-full">
      <div className="max-w-[720px] w-[80%] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-white">Buscar Lembrete</h1>
        <SearchRemind />

        <RemindList annotations={annotations} />
      </div>
    </main>
  );
}
