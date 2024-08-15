// src\app\search\page.tsx

"use client";

import RemindList from "@/components/Remind/remind";
import { SearchRemind } from "@/components/searchRemind";
import { annotations } from "@/utils/mockData";

export default function SearchPage() {
  return (
    <main className="flex flex-col justify-start items-center p-8 w-full">
      <div className="max-w-[720px] w-[80%] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Buscar Lembrete
        </h1>
        <SearchRemind />

        <RemindList annotations={annotations} />
      </div>
    </main>
  );
}
