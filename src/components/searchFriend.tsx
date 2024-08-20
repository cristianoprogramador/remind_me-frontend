import CategorySelect, { CategoryOption } from "@/components/categorySelect";
import { useState } from "react";

export function SearchFriend() {
  return (
    <div className="border rounded-md w-full flex flex-col mb-7">
      <div className="flex flex-row items-center justify-center">
        <input
          type="text"
          className="w-full bg-transparent pl-5 py-4 text-white outline-none"
          placeholder="Buscar por..."
        />
        <button className="h-10 w-32 bg-gray-200 text-slate-800 transition-all duration-400 ease-in-out transform hover:bg-blue-600 hover:text-white rounded-md mr-4">
          Buscar
        </button>
      </div>
    </div>
  );
}
