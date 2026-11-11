// Selection behaviour of ForteTable, checked on the "Data grid (1000 records)" example page.
const { test, expect } = require('@playwright/test');

const COLUMNS = 15;

const cell = (page, row, col) =>
  page.locator(`[data-ft-row="${row}"] [data-ft-col="${col}"]`);
const heading = (page, row) =>
  page.locator(`[data-ft-row="${row}"] .ft-row__heading`);
const selectedCells = page => page.locator('.ft-cell-selected');
const activeCell = page => page.locator('.ft-cell__container--active');
const statusBar = page => page.locator('.dg-status-bar');

async function center(locator) {
  const box = await locator.boundingBox();
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

async function drag(page, from, to) {
  const a = await center(from);
  const b = await center(to);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps: 6 });
  await page.mouse.up();
}

const expectActive = (page, row, col) =>
  expect(cell(page, row, col)).toHaveClass(/ft-cell__container--active/);

let pageErrors = [];

test.beforeEach(async ({ page }) => {
  pageErrors = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  page.on('console', m => m.type() === 'error' && pageErrors.push(m.text()));

  await page.goto('/');
  await expect(page.locator('[data-ft-row="999"]')).toHaveCount(1);
});

test.afterEach(() => {
  expect(pageErrors).toEqual([]);
});

test('renders 1000 records', async ({ page }) => {
  await expect(page.locator('.ft-row')).toHaveCount(1000);
  await expect(statusBar(page)).toContainText('1000 records');
});

test('single click activates a cell without selecting', async ({ page }) => {
  await cell(page, 3, 2).click();
  await expectActive(page, 3, 2);
  await expect(activeCell(page)).toHaveCount(1);
  await expect(selectedCells(page)).toHaveCount(0);
});

test('dragging over cells selects a rectangle', async ({ page }) => {
  await drag(page, cell(page, 1, 1), cell(page, 4, 3));

  await expect(selectedCells(page)).toHaveCount(4 * 3);
  await expect(cell(page, 1, 1)).toHaveClass(/ft-cell-selected/);
  await expect(cell(page, 4, 3)).toHaveClass(/ft-cell-selected/);
  await expect(cell(page, 5, 3)).not.toHaveClass(/ft-cell-selected/);
  await expect(cell(page, 1, 4)).not.toHaveClass(/ft-cell-selected/);
  await expectActive(page, 1, 1);
  await expect(statusBar(page)).toContainText(
    'Selection: 4 record(s) x 3 column(s)'
  );
});

test('dragging backwards normalizes the rectangle', async ({ page }) => {
  await drag(page, cell(page, 6, 4), cell(page, 3, 2));

  await expect(selectedCells(page)).toHaveCount(4 * 3);
  await expect(statusBar(page)).toContainText(
    'Selection: 4 record(s) x 3 column(s)'
  );
});

test('a new click clears the previous selection', async ({ page }) => {
  await drag(page, cell(page, 1, 1), cell(page, 4, 3));
  await expect(selectedCells(page)).toHaveCount(12);

  await cell(page, 8, 5).click();
  await expect(selectedCells(page)).toHaveCount(0);
  await expectActive(page, 8, 5);
});

test('shift+click extends the selection from the active cell', async ({
  page,
}) => {
  await cell(page, 2, 2).click();
  await cell(page, 6, 4).click({ modifiers: ['Shift'] });

  await expect(selectedCells(page)).toHaveCount(5 * 3);
  await expectActive(page, 2, 2);
  await expect(statusBar(page)).toContainText(
    'Selection: 5 record(s) x 3 column(s)'
  );
});

test('shift+arrows extend the selection from its moving corner', async ({
  page,
}) => {
  await drag(page, cell(page, 1, 1), cell(page, 4, 3));
  await expect(selectedCells(page)).toHaveCount(12);

  await page.keyboard.press('Shift+ArrowDown');
  await expect(selectedCells(page)).toHaveCount(5 * 3);

  await page.keyboard.press('Shift+ArrowRight');
  await expect(selectedCells(page)).toHaveCount(5 * 4);

  await page.keyboard.press('Shift+ArrowUp');
  await page.keyboard.press('Shift+ArrowLeft');
  await expect(selectedCells(page)).toHaveCount(4 * 3);

  // the active cell stays on the anchor
  await expectActive(page, 1, 1);
});

test('shift+arrows from a single active cell start a selection', async ({
  page,
}) => {
  await cell(page, 5, 5).click();
  await page.keyboard.press('Shift+ArrowDown');
  await page.keyboard.press('Shift+ArrowDown');

  await expect(selectedCells(page)).toHaveCount(3);
  await expectActive(page, 5, 5);
});

test('arrow keys without shift move the active cell and clear the selection', async ({
  page,
}) => {
  await drag(page, cell(page, 1, 1), cell(page, 4, 3));
  await page.keyboard.press('ArrowRight');

  await expect(selectedCells(page)).toHaveCount(0);
  await expectActive(page, 1, 2);
  await expect(activeCell(page)).toHaveCount(1);
});

test('dragging over row headings selects whole records', async ({ page }) => {
  await drag(page, heading(page, 10), heading(page, 12));

  await expect(page.locator('.ft-row--selected')).toHaveCount(3);
  await expect(selectedCells(page)).toHaveCount(3 * COLUMNS);
  await expect(statusBar(page)).toContainText(
    `Selection: 3 record(s) x ${COLUMNS} column(s)`
  );
});

test('shift+click on a row heading extends the record selection', async ({
  page,
}) => {
  await heading(page, 4).click();
  await heading(page, 7).click({ modifiers: ['Shift'] });

  await expect(page.locator('.ft-row--selected')).toHaveCount(4);
  await expect(selectedCells(page)).toHaveCount(4 * COLUMNS);
});

test('shift+arrow after a record selection keeps full rows', async ({
  page,
}) => {
  await drag(page, heading(page, 2), heading(page, 3));
  await page.keyboard.press('Shift+ArrowDown');

  await expect(page.locator('.ft-row--selected')).toHaveCount(3);
  await expect(selectedCells(page)).toHaveCount(3 * COLUMNS);
});

test('releasing the mouse outside the table ends the drag', async ({
  page,
}) => {
  const a = await center(cell(page, 1, 1));
  const b = await center(cell(page, 3, 2));
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps: 4 });
  // single step: no intermediate mousemove over other cells
  await page.mouse.move(5, 5);
  await page.mouse.up();
  await expect(selectedCells(page)).toHaveCount(3 * 2);

  // moving over other cells after release must not change the selection
  const c = await center(cell(page, 6, 5));
  await page.mouse.move(c.x, c.y, { steps: 4 });
  await expect(selectedCells(page)).toHaveCount(3 * 2);
});

test('selection works on fixed columns while scrolled horizontally', async ({
  page,
}) => {
  await page.locator('.ft-table').evaluate(el => {
    el.scrollLeft = 600;
  });
  await drag(page, cell(page, 1, 0), cell(page, 2, 1));

  await expect(selectedCells(page)).toHaveCount(2 * 2);
  await expect(statusBar(page)).toContainText(
    'Selection: 2 record(s) x 2 column(s)'
  );
});

test('imperative API selectRange / clearSelection', async ({ page }) => {
  await page.getByRole('button', { name: 'Select first 10 records' }).click();
  await expect(selectedCells(page)).toHaveCount(10 * COLUMNS);
  await expect(statusBar(page)).toContainText(
    `Selection: 10 record(s) x ${COLUMNS} column(s)`
  );

  await page.getByRole('button', { name: 'Clear selection' }).click();
  await expect(selectedCells(page)).toHaveCount(0);
});

test('onCellSelectionChange reports numeric stats of the selected records', async ({
  page,
}) => {
  // column 0 is "#" (record id): rows 0..2 have ids 1..3
  await drag(page, cell(page, 0, 0), cell(page, 2, 0));
  await expect(statusBar(page)).toContainText('#: sum 6, avg 2');
});
