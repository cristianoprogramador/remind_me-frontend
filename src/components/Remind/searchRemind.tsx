import CategorySelect from "@/components/categorySelect";
import { CategoryOption } from "@/types";
import { useState } from "react";

export function SearchRemind({
  onSearch,
}: {
  onSearch: (query: string, categoryId: string | null) => void;
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(null);

  const handleCategoryChange = (category: CategoryOption | null) => {
    setSelectedCategory(category);
  };

  const handleSearch = () => {
    const categoryId = selectedCategory ? selectedCategory.value : null;
    onSearch(searchQuery, categoryId);
  };

  return (
    <div className="border rounded-md w-full flex flex-col mb-7">
      <div className="flex flex-row items-center justify-center">
        <input
          type="text"
          className="w-full bg-transparent pl-5 py-4 text-white outline-none"
          placeholder="Buscar por..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-wrap mx-4 w-72 text-xs">
          <CategorySelect
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
          />
        </div>
        <button
          className="h-10 w-32 bg-gray-200 text-slate-800 transition-all duration-400 ease-in-out transform hover:bg-blue-600 hover:text-white rounded-md mr-4"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>
    </div>
  );
}
