import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    // Remove duplicates and sort
    return [...new Set(pageNumbers)].sort((a, b) => a - b);
  };
  
  const pageNumbers = getPageNumbers();
  
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <nav className={`flex justify-center ${className}`} aria-label="Pagination">
      <ul className="inline-flex items-center -space-x-px">
        {/* Previous button */}
        <li>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg ${
              currentPage === 1
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
        
        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          // Add ellipsis if there's a gap
          const prevPage = pageNumbers[index - 1];
          const showEllipsisBefore = prevPage && page - prevPage > 1;
          
          return (
            <React.Fragment key={page}>
              {showEllipsisBefore && (
                <li>
                  <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">
                    ...
                  </span>
                </li>
              )}
              <li>
                <button
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 leading-tight border ${
                    currentPage === page
                      ? 'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                      : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  {page}
                </button>
              </li>
            </React.Fragment>
          );
        })}
        
        {/* Next button */}
        <li>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg ${
              currentPage === totalPages
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
