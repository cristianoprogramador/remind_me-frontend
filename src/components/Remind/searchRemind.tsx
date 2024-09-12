import CategorySelect from "@/components/categorySelect";
import { CategoryOption } from "@/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function SearchRemind({
  onSearch,
}: {
  onSearch: (query: string, categoryId: string | null) => void;
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(null);
  const { t } = useTranslation();

  const handleCategoryChange = (category: CategoryOption | null) => {
    setSelectedCategory(category);
  };

  const handleSearch = () => {
    const categoryId = selectedCategory ? selectedCategory.value : null;
    onSearch(searchQuery, categoryId);
  };

  return (
    <div className="border border-theme-border-color rounded-md w-full flex flex-col mb-7">
      <div className="md:flex grid grid-cols-1 md:flex-row w-ful items-center justify-center">
        <input
          type="text"
          className="w-full bg-transparent pl-5 py-4 text-theme-text-color outline-none"
          placeholder={t("searchRemind.placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="md:flex md:mx-4 w-full md:w-72 md:text-xs px-4 md:px-0">
          <CategorySelect
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
          />
        </div>
        <div className="flex items-center justify-center text-center my-3 md:my-0">
          <button
            className="h-10 w-28 bg-gray-200 text-slate-800 transition-all duration-400 ease-in-out transform hover:bg-blue-600 hover:text-white rounded-md mr-4"
            onClick={handleSearch}
          >
            {t("searchRemind.searchButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
