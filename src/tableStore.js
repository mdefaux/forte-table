/** Minimal external store holding the interactive state of a table
 *  (active cell and selection). Rows subscribe with useSyncExternalStore
 *  so that only the rows whose state actually changes are re-rendered.
 */
export function createTableStore() {
  let state = {
    activeRow: -1,
    activeCol: -1,
    selection: null, // { c0, c1, r0, r1 } inclusive, or null
  };
  const listeners = new Set();

  return {
    getState: () => state,
    setState(patch) {
      state = { ...state, ...patch };
      listeners.forEach(listener => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function toRect(a, b) {
  return {
    c0: Math.min(a.col, b.col),
    c1: Math.max(a.col, b.col),
    r0: Math.min(a.row, b.row),
    r1: Math.max(a.row, b.row),
  };
}

export function sameRect(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.c0 === b.c0 && a.c1 === b.c1 && a.r0 === b.r0 && a.r1 === b.r1;
}
