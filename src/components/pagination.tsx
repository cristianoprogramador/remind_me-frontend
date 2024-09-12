import { useTheme } from "@/app/theme-context";
import React from "react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const { theme } = useTheme();
  const { t } = useTranslation();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center mt-4 text-white">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-400 rounded-l-md disabled:bg-gray-800 border border-theme-border-color disabled:text-white disabled:cursor-not-allowed"
      >
        {t("pagination.previous")}
      </button>
      <div
        className={`px-4 py-2  ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {t("pagination.page")} {currentPage} {t("pagination.of")} {totalPages}
      </div>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-400 rounded-r-md disabled:bg-gray-800 border border-theme-border-color disabled:text-white disabled:cursor-not-allowed"
      >
        {t("pagination.next")}
      </button>
    </div>
  );
};
