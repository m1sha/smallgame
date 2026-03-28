import {  NumericTable } from '../src/utils'
test('table cell', () => {
  const table = new NumericTable(10, 10)
  table.cell(9, 9, 1)

  expect(table.cell(9, 9)).toEqual(1)
})