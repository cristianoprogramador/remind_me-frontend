import React from "react";

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
        className="px-4 py-2 bg-gray-400 rounded-l-md disabled:bg-gray-800 border border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      <span className="px-4 py-2">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-400 rounded-r-md disabled:bg-gray-800 border border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Próxima
      </button>
    </div>
  );
};
