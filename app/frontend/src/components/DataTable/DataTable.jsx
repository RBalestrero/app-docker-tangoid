import { Fragment, useEffect, useMemo, useState } from 'react';
import styles from './DataTable.module.css';

function DataTable({
  columns,
  data,
  renderExpandedRow,
  expandable = false,
  getRowId,
  expandedRowId: controlledExpandedRowId,
  onToggleExpand,
}) {
  const [internalExpandedRowId, setInternalExpandedRowId] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  const isControlledExpand = typeof onToggleExpand === 'function';
  const expandedRowId = isControlledExpand
    ? controlledExpandedRowId ?? null
    : internalExpandedRowId;

  useEffect(() => {
    if (!isControlledExpand) {
      setInternalExpandedRowId(null);
    }
  }, [data, isControlledExpand]);

  const resolveRowId = (row, rowIndex) => {
    if (typeof getRowId === 'function') {
      return getRowId(row, rowIndex);
    }

    return row.id ?? row._id ?? row.numero_remito ?? `row-${rowIndex}`;
  };

  const toggleExpand = (row, rowIndex) => {
    if (!expandable) return;

    const rowId = resolveRowId(row, rowIndex);

    if (isControlledExpand) {
      onToggleExpand(rowId, row, rowIndex);
      return;
    }

    setInternalExpandedRowId((prev) => (prev === rowId ? null : rowId));
  };

  const handleSort = (column) => {
    if (!column.sortable || !column.key) return;

    setSortConfig((prev) => {
      if (prev.key !== column.key) {
        return { key: column.key, direction: 'asc' };
      }

      if (prev.direction === 'asc') {
        return { key: column.key, direction: 'desc' };
      }

      if (prev.direction === 'desc') {
        return { key: null, direction: null };
      }

      return { key: column.key, direction: 'asc' };
    });
  };

  const getCellSortValue = (column, row, rowIndex) => {
    if (typeof column.sortValue === 'function') {
      return column.sortValue(row[column.key], row, rowIndex);
    }

    return row[column.key];
  };

  const compareValues = (a, b, sortType = 'string') => {
    const aEmpty = a === null || a === undefined || a === '';
    const bEmpty = b === null || b === undefined || b === '';

    if (aEmpty && bEmpty) return 0;
    if (aEmpty) return 1;
    if (bEmpty) return -1;

    switch (sortType) {
      case 'number': {
        const numA = Number(a);
        const numB = Number(b);

        if (Number.isNaN(numA) && Number.isNaN(numB)) return 0;
        if (Number.isNaN(numA)) return 1;
        if (Number.isNaN(numB)) return -1;

        return numA - numB;
      }

      case 'date': {
        const timeA = new Date(a).getTime();
        const timeB = new Date(b).getTime();

        const invalidA = Number.isNaN(timeA);
        const invalidB = Number.isNaN(timeB);

        if (invalidA && invalidB) return 0;
        if (invalidA) return 1;
        if (invalidB) return -1;

        return timeA - timeB;
      }

      case 'string':
      default:
        return String(a).localeCompare(String(b), 'es', {
          sensitivity: 'base',
          numeric: true,
        });
    }
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    const targetColumn = columns.find((col) => col.key === sortConfig.key);
    if (!targetColumn) return data;

    const sortType = targetColumn.sortType || 'string';

    return [...data].sort((rowA, rowB) => {
      const valueA = getCellSortValue(targetColumn, rowA);
      const valueB = getCellSortValue(targetColumn, rowB);

      const result = compareValues(valueA, valueB, sortType);
      return sortConfig.direction === 'asc' ? result : -result;
    });
  }, [data, columns, sortConfig]);

  const getSortIndicator = (column) => {
    if (!column.sortable) return null;

    if (sortConfig.key !== column.key || !sortConfig.direction) {
      return '↕';
    }

    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={styles.tableResponsive}>
      <table className={`table align-middle mb-0 ${styles.table}`}>
        <thead>
          <tr>
            {columns.map((col, index) => {
              const isSortable = Boolean(col.sortable);
              const isActiveSort =
                sortConfig.key === col.key && Boolean(sortConfig.direction);

              return (
                <th
                  key={col.key || `col-${index}`}
                  className={`${styles.headerCell} ${col.headerClassName || ''} ${
                    isSortable ? styles.sortableHeader : ''
                  } ${isActiveSort ? styles.sortedHeader : ''}`.trim()}
                  onClick={() => handleSort(col)}
                  scope="col"
                >
                  <span className={styles.headerContent}>
                    <span>{col.label}</span>

                    {isSortable && (
                      <span
                        className={`${styles.sortIndicator} ${
                          isActiveSort ? styles.sortIndicatorActive : ''
                        }`}
                        aria-hidden="true"
                      >
                        {getSortIndicator(col)}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                Sin registros
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => {
              const rowId = resolveRowId(row, rowIndex);
              const isExpanded = expandedRowId === rowId;

              return (
                <Fragment key={rowId}>
                  <tr className={isExpanded ? styles.expandedClickableRow : ''}>
                    {columns.map((col, colIndex) => (
                      <td
                        key={`${col.key || 'col'}-${colIndex}`}
                        className={`${styles.bodyCell} ${col.cellClassName || ''}`.trim()}
                        onClick={(e) => {
                          if (col.stopRowClick) {
                            e.stopPropagation();
                          }
                        }}
                      >
                        {col.render
                          ? col.render(row[col.key], row, rowIndex)
                          : row[col.key]}
                      </td>
                    ))}
                  </tr>

                  {expandable && isExpanded && renderExpandedRow && (
                    <tr className={styles.expandedRow}>
                      <td colSpan={columns.length}>
                        <div className={styles.expandedContent}>
                          {renderExpandedRow(row)}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;