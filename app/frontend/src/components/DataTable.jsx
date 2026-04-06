import { useState, Fragment } from 'react';

function DataTable({
  columns,
  data,
  renderExpandedRow,
  expandable = false,
  getRowId,
}) {
  const [expandedRowId, setExpandedRowId] = useState(null);

  const resolveRowId = (row, rowIndex) => {
    if (typeof getRowId === 'function') {
      return getRowId(row, rowIndex);
    }

    return row.id ?? row._id ?? row.numero_remito ?? `row-${rowIndex}`;
  };

  const handleRowClick = (row, rowIndex) => {
    if (!expandable) return;

    const rowId = resolveRowId(row, rowIndex);
    setExpandedRowId((prev) => (prev === rowId ? null : rowId));
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
              const rowId = resolveRowId(row, rowIndex);
              const isExpanded = expandedRowId === rowId;

              return (
                <Fragment key={rowId}>
                  <tr
                    className={`pedidos-clickable-row ${isExpanded ? 'is-expanded' : ''}`}
                    onClick={() => handleRowClick(row, rowIndex)}
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