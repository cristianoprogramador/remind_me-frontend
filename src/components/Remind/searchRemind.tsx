import CategorySelect, { CategoryOption } from "@/components/categorySelect";
import { useState } from "react";

const initialCategories = [
  { label: "Trabalho", value: "trabalho" },
  { label: "Pessoal", value: "pessoal" },
  { label: "Estudos", value: "estudos" },
];

export function SearchRemind() {
  const [categories, setCategories] =
    useState<CategoryOption[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(null);

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
          className="w-full bg-transparent pl-5 py-4 text-white outline-none"
          placeholder="Buscar por..."
        />
        <div className="flex flex-wrap mx-4 w-72 text-xs">
          <CategorySelect
            categories={categories}
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
            onAddCategory={handleAddCategory}
          />
        </div>
        <button className="h-10 w-32 bg-gray-200 text-slate-800 transition-all duration-400 ease-in-out transform hover:bg-blue-600 hover:text-white rounded-md mr-4">
          Buscar
        </button>
      </div>
    </div>
  );
}
