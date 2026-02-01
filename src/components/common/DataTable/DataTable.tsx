import React from 'react';
import styles from './DataTable.module.scss';
import clsx from 'clsx';
import { Spinner } from '../Spinner/Spinner';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  pagination,
  onPageChange,
  sortBy,
  sortOrder,
  onSort,
  className
}: DataTableProps<T>) {
  const handleSort = (column: Column<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  const renderCell = (row: T, column: Column<T>) => {
    if (column.render) {
      return column.render(row);
    }
    return row[column.key];
  };

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 0;

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(
                    styles.th,
                    column.sortable && styles.sortable
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column)}
                >
                  <div className={styles.thContent}>
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className={styles.sortIcon}>
                        {sortBy === column.key ? (
                          sortOrder === 'asc' ? '↑' : '↓'
                        ) : (
                          '↕'
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className={styles.loadingCell}>
                  <Spinner size="lg" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.emptyCell}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  className={clsx(
                    styles.tr,
                    onRowClick && styles.clickable
                  )}
                  onClick={() => onRowClick && onRowClick(row)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                >
                  {columns.map((column) => (
                    <td key={column.key} className={styles.td}>
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => onPageChange && onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            aria-label="Previous page"
          >
            ←
          </button>
          <span className={styles.pageInfo}>
            Page {pagination.page} of {totalPages}
          </span>
          <button
            className={styles.pageButton}
            onClick={() => onPageChange && onPageChange(pagination.page + 1)}
            disabled={pagination.page >= totalPages}
            aria-label="Next page"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
