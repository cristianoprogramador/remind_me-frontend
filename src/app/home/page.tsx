// src\app\home\page.tsx

"use client";

import { useEffect, useState } from "react";
import { CreateRemind } from "@/components/Remind/createRemind";
import RemindList from "@/components/Remind/remind";
import { useSession } from "next-auth/react";
import { Annotation, UserProps } from "@/types";

export default function HomePage() {
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

  const handleUpdateRemindAt = async (
    annotationId: string,
    newRemindAt: string
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/annotations/${annotationId}/remindAt`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
          },
          body: JSON.stringify({
            remindAt: new Date(newRemindAt).toISOString(),
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update remindAt");
      }

      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annotation) =>
          annotation.uuid === annotationId
            ? { ...annotation, remindAt: newRemindAt }
            : annotation
        )
      );
    } catch (error) {
      console.error("Error updating remindAt:", error);
    }
  };

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
            onUpdateRemindAt={handleUpdateRemindAt}
          />
        )}
      </div>
    </main>
  );
}
