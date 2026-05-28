import { Pagination as BootstrapPagination } from 'react-bootstrap';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <BootstrapPagination className="justify-content-center">
      <BootstrapPagination.First
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      />
      <BootstrapPagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      {start > 1 && (
        <>
          <BootstrapPagination.Item onClick={() => onPageChange(1)}>1</BootstrapPagination.Item>
          {start > 2 && <BootstrapPagination.Ellipsis disabled />}
        </>
      )}

      {pages.map((page) => (
        <BootstrapPagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </BootstrapPagination.Item>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <BootstrapPagination.Ellipsis disabled />}
          <BootstrapPagination.Item onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </BootstrapPagination.Item>
        </>
      )}

      <BootstrapPagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <BootstrapPagination.Last
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </BootstrapPagination>
  );
}
