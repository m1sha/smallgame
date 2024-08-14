import { Rect } from '../src/rect'

test('rect equals', () => {
  const r1 = new Rect(0, 0, 10, 10)
  const r2 = new Rect(0, 0, 10, 10)
  expect(r1.equals(r2)).toBeTruthy()

  const r3 = new Rect(10, 0, 10, 10)
  const r4 = new Rect(0, 0, 10, 10)
  expect(r3.equals(r4)).toBeFalsy()
})