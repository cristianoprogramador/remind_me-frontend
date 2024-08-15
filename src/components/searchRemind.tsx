import CategorySelect, { CategoryOption } from "@/components/categorySelect";
import UserSelect from "@/components/userSelect";
import { useState } from "react";
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
  { label: "Trabalho", value: "trabalho" },
  { label: "Pessoal", value: "pessoal" },
  { label: "Estudos", value: "estudos" },
];

export function SearchRemind() {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(["1"]);
  const fixedUserId = "1";

  const [categories, setCategories] =
    useState<CategoryOption[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(null);

  const handleUserChange = (ids: string[]) => {
    setSelectedUserIds(ids);
    console.log("Usuários selecionados:", ids);
  };

  const handleCategoryChange = (category: CategoryOption | null) => {
    setSelectedCategory(category);
    console.log("Categoria selecionada:", category);
  };

  const handleAddCategory = (newCategory: string) => {
    const newCategoryObj = {
      label: newCategory,
      value: newCategory.toLowerCase(),
    };
    setCategories((prevCategories) => [...prevCategories, newCategoryObj]);
    setSelectedCategory(newCategoryObj);
    console.log("Nova categoria adicionada:", newCategoryObj);
  };
  return (
    <div className="border rounded-md w-full flex flex-col mb-7">
      <div className="flex flex-row items-center justify-center">
        <input
          type="text"
          className="w-full bg-transparent pl-5 py-4 text-white"
          placeholder="Escreva algo para buscar..."
        />
        <button className="h-10 w-32 bg-gray-200 text-slate-800 transition-all duration-400 ease-in-out transform hover:bg-blue-600 hover:text-white rounded-md mr-4">
          Buscar
        </button>
      </div>
      <div className="h-[1px] w-full bg-gray-300 mb-4" />
      <div className="flex flex-row text-white justify-between items-center mb-2">
        <div className="flex flex-row gap-3 ml-4 items-center text-xs">
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
    </div>
  );
}
