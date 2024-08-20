// src\app\home\page.tsx

"use client";

import { CreateRemind } from "@/components/Remind/createRemind";
import RemindList from "@/components/Remind/remind";
import { annotations } from "@/utils/mockData";

export default function HomePage() {
  return (
    <main className="flex flex-col justify-start items-center p-8 w-full">
      <div className="max-w-[720px] w-[80%] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Próximos Lembretes
        </h1>
        <CreateRemind />
        <RemindList annotations={annotations} />
      </div>
    </main>
  );
}
