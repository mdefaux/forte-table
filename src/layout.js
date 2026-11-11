export const ROW_HEADER_WIDTH = 48;
export const HEADER_HEIGHT = 40;
export const DEFAULT_COLUMN_WIDTH = 150;
export const MIN_COLUMN_WIDTH = 30;

export function columnKey(column, index) {
  if (column !== null && typeof column === 'object') {
    return column.name != null ? String(column.name) : `col-${index}`;
  }
  return column != null ? String(column) : `col-${index}`;
}

export function columnLabel(column) {
  if (column !== null && typeof column === 'object') {
    return column.title || column.label || column.name;
  }
  return column;
}

export const cssSize = width =>
  typeof width === 'number' ? `${width}px` : String(width);

export const toPx = width =>
  typeof width === 'number' ? width : parseFloat(width) || DEFAULT_COLUMN_WIDTH;

/** Builds the CSS custom properties used by header and body cells:
 *  --ft-w-{i} is the width of column i, --ft-l-{i} the sticky left offset of fixed column i.
 */
export function columnVars(widths, fixedCount) {
  const vars = {};
  let left = ROW_HEADER_WIDTH;

  widths.forEach((width, index) => {
    vars[`--ft-w-${index}`] = cssSize(width);
    if (index < fixedCount) {
      vars[`--ft-l-${index}`] = `${left}px`;
      left += toPx(width);
    }
  });

  return { vars, fixedWidth: left };
}
