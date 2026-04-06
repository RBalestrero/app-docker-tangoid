import { useState } from 'react';

function DataTable({ columns, data, renderExpandedRow, expandable = false }) {
  const [expandedRowId, setExpandedRowId] = useState(null);

  const handleRowClick = (row) => {
    if (!expandable) return;

    setExpandedRowId((prev) => (prev === row.id ? null : row.id));
  };

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0 pedidos-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key || `col-${index}`}
                className={col.headerClassName || ''}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                Sin registros
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const isExpanded = expandedRowId === row.id;

              return (
                <>
                  <tr
                    key={row.id || rowIndex}
                    className={`pedidos-clickable-row ${isExpanded ? 'is-expanded' : ''}`}
                    onClick={() => handleRowClick(row)}
                    style={{ cursor: expandable ? 'pointer' : 'default' }}
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={`${col.key || 'col'}-${colIndex}`}
                        className={col.cellClassName || ''}
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
                    <tr className="pedidos-expanded-row">
                      <td colSpan={columns.length}>
                        <div className="pedidos-expanded-content">
                          {renderExpandedRow(row)}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;