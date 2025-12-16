import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./Button";

const DOTS = "...";

const PaginationButton = ({ children, variant = "alternative", page }) => {
  const navigate = useNavigate();
  return (
    <Button variant={variant} className="hover" handleClick={() => navigate(`?page=${page}`)}>
      {children}
    </Button>
  );
};

// Hook helper để tạo ra dải phân trang có dấu "..."
const usePaginationRange = ({
  totalPages,
  currentPage,
  siblingCount = 1,
}) => {
  const paginationRange = useMemo(() => {
    // Tổng số trang hiển thị: siblingCount mỗi bên + trang đầu + trang cuối + trang hiện tại + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    // Trường hợp 1: Nếu tổng số trang ít hơn số trang muốn hiển thị, trả về toàn bộ dải trang.
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Trường hợp 2: Không có dấu "..." bên trái, nhưng cần bên phải.
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPages];
    }

    // Trường hợp 3: Không có dấu "..." bên phải, nhưng cần bên trái.
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Trường hợp 4: Cần cả dấu "..." bên trái và phải.
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalPages, currentPage, siblingCount]);

  return paginationRange || [];
};

const PaginationNav = ({ totalPages, currentPage, siblingCount = 1 }) => {
  const pageNumbers = usePaginationRange({ totalPages, currentPage, siblingCount });

  if (currentPage === 0 || pageNumbers.length < 2) {
    return null;
  }

  return (
    <nav aria-label="Page navigation" className="justify-center flex">
      <ul className="flex -space-x-px text-sm">
        {currentPage > 1 && <li><PaginationButton page={currentPage - 1}>Previous</PaginationButton></li>}
        {pageNumbers.map((page, index) => {
          if (page === DOTS) {
            return <li key={DOTS + index}><Button variant="alternative" disabled>{DOTS}</Button></li>;
          }
          return <li key={page}><PaginationButton variant={page === currentPage ? "green" : "alternative"} page={page}>{page}</PaginationButton></li>;
        })}
        {currentPage < totalPages && <li><PaginationButton page={currentPage + 1}>Next</PaginationButton></li>}
      </ul>
    </nav>
  );
};

export default PaginationNav;
