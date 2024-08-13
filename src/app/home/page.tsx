// src\app\home\page.tsx

"use client";

import CategorySelect, { CategoryOption } from "@/components/categorySelect";
import UserSelect from "@/components/userSelect";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { CiImageOn } from "react-icons/ci";
import { FiCalendar } from "react-icons/fi";

const users = [
  { id: "1", nome: "Cristiano" },
  { id: "2", nome: "Camila" },
  { id: "3", nome: "Joaquim" },
  { id: "4", nome: "Caio" },
  { id: "5", nome: "Luiz" },
];

const initialCategories = [
  { label: 'Trabalho', value: 'trabalho' },
  { label: 'Pessoal', value: 'pessoal' },
  { label: 'Estudos', value: 'estudos' },
];

export default function HomePage() {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(["1"]);
  const fixedUserId = "1";

  const [categories, setCategories] = useState<CategoryOption[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);

  const annotations = [
    {
      id: "1",
      createdAt: "12 de agosto de 2024",
      remindAt: "15 de agosto de 2024",
      text: "Lembrete para reunião com o time de desenvolvimento.",
      image: "/fototeste.png",
      category: "Trabalho",
      status: "Pendente",
      creator: "Cristiano Silva",
      collaborators: ["Cristiano Silva", "Camila Moretti"],
    },
    {
      id: "2",
      createdAt: "11 de agosto de 2024",
      remindAt: "14 de agosto de 2024",
      text: "Comprar presentes de aniversário.",
      image: null,
      category: "Pessoal",
      status: "Concluído",
      creator: "Cristiano Silva",
      collaborators: ["Cristiano Silva"],
    },
  ];

  const handleUserChange = (ids: string[]) => {
    setSelectedUserIds(ids);
    console.log("Usuários selecionados:", ids);
  };

  const handleCategoryChange = (category: CategoryOption | null) => {
    setSelectedCategory(category);
    console.log("Categoria selecionada:", category);
  };

  const handleAddCategory = (newCategory: string) => {
    const newCategoryObj = { label: newCategory, value: newCategory.toLowerCase() };
    setCategories((prevCategories) => [...prevCategories, newCategoryObj]);
    setSelectedCategory(newCategoryObj); // Seleciona a nova categoria automaticamente
    console.log("Nova categoria adicionada:", newCategoryObj);
  };


  return (
    <main className="flex flex-col justify-start items-center p-8 w-full">
      <div className=" max-w-[700px] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-white">Minhas Anotações</h1>
        <div className="border rounded-md w-full flex flex-col mb-7">
          <div>
            <input
              type="text"
              className="w-full bg-transparent pl-5 py-4 text-white"
              placeholder="Eu preciso lembrar de..."
            />
          </div>
          <div className="h-[1px] w-full bg-gray-300 mb-4" />
          <div className="flex flex-row gap-3 text-white justify-start ml-4 items-center mb-2">
            <CiImageOn size={25} />
            <div className="relative flex items-center">
              <input
                type="datetime-local"
                className="bg-transparent text-white pl-10 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiCalendar
                className="absolute left-3 text-white pointer-events-none"
                size={20}
              />
            </div>
            <UserSelect
              users={users}
              selectedUserIds={selectedUserIds}
              onChange={handleUserChange}
              fixedUserId={fixedUserId}
            />
            <CategorySelect
              categories={categories}
              selectedCategory={selectedCategory}
              onChange={handleCategoryChange}
              onAddCategory={handleAddCategory}
            />
          </div>
        </div>
        <div className="space-y-2 w-full max-w-3xl">
          {annotations.map((annotation) => (
            <div
              key={annotation.id}
              className="bg-white p-4 rounded-md shadow-md"
            >
              <div className="mb-4 text-sm text-gray-500 flex flex-row justify-between">
                <span>
                  Criado em:{" "}
                  <b className="text-black">{annotation.createdAt}</b>
                </span>
                <span className="flex flex-row gap-1">
                  Lembrar em:{" "}
                  <b className="text-black">{annotation.remindAt}</b>{" "}
                  <AiOutlineEdit
                    size={20}
                    color="black"
                    className="cursor-pointer hover:opacity-80"
                  />
                </span>
              </div>
              <h2 className="font-semibold text-xl">{annotation.text}</h2>
              {annotation.image && (
                <div className="flex items-center justify-center my-3">
                  <Image
                    src={annotation.image}
                    alt="Imagem da anotação"
                    layout="responsive"
                    width={100}
                    height={100}
                    className="rounded-md object-cover max-w-[500px]"
                  />
                </div>
              )}
              <div className="mt-4 text-sm text-gray-500 grid grid-cols-2">
                <span className="text-black">
                  Categoria: <b> {annotation.category}</b>
                </span>
                <span className="text-black">
                  Status: <b>{annotation.status}</b>{" "}
                </span>
                <span className="text-black">
                  Criado por: <b> {annotation.creator}</b>
                </span>
                <span className="text-black">
                  Participantes: {annotation.collaborators.join(", ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
