export const getRowData = record =>
  record && record._getData ? record._getData() : record;

/** Builds the object passed to callbacks as "cell". It mirrors the former class
 *  component shape (cell.props.*) so that existing consumers keep working.
 */
export function makeCellHandle({
  record,
  column,
  rowIndex,
  columnIndex,
  activeRow,
  isActive,
  isSelected,
  errorText,
  setActive,
  getController,
  model,
}) {
  const row = getRowData(record);
  return {
    props: {
      column,
      row,
      record,
      rowId: record != null ? record.id : undefined,
      rowIndex,
      columnIndex,
      index: columnIndex,
      activeRow,
      isActive,
      isSelected,
      errorText,
      setActive,
      model,
    },
    column,
    row,
    rowIndex,
    columnIndex,
    isActive,
    isSelected,
    getController,
  };
}
