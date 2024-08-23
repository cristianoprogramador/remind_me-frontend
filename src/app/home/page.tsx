// src\app\home\page.tsx

"use client";

import { useEffect, useState } from "react";
import { CreateRemind } from "@/components/Remind/createRemind";
import { useSession } from "next-auth/react";
import { Annotation, UserProps } from "@/types";
import RemindList from "@/components/Remind/remindList";

export default function HomePage() {
  const { data: session } = useSession();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnotations = async () => {
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
          }
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
  };

  useEffect(() => {
    fetchAnnotations();
  }, [session]);

  const addAnnotation = (newAnnotation: Annotation) => {
    setAnnotations((prevAnnotations) => [newAnnotation, ...prevAnnotations]);
  };

  return (
    <main className="flex flex-col justify-start items-center p-8 w-full">
      <div className="max-w-[720px] w-[90%] xl:w-[80%] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Próximos Lembretes
        </h1>
        <CreateRemind onCreate={addAnnotation} />
        {loading ? (
          <p className="text-white">Carregando lembretes...</p>
        ) : (
          <RemindList
            annotations={annotations}
            fetchAnnotations={fetchAnnotations}
          />
        )}
      </div>
    </main>
  );
}
