import { Point } from '../src/point'
import { Rect } from '../src/rect'

test('rect equals', () => {
  const r1 = new Rect(0, 0, 10, 10)
  const r2 = new Rect(0, 0, 10, 10)
  expect(r1.equals(r2)).toBeTruthy()

  const r3 = new Rect(10, 0, 10, 10)
  const r4 = new Rect(0, 0, 10, 10)
  expect(r3.equals(r4)).toBeFalsy()
})

test('rect center', () => {
  const rect = new Rect(-1, -1, 1, 1)
  expect(rect.center).toMatchObject(new Point(0.5, 0.5))
})

test('rect absCenter', () => {
  const rect = new Rect(-0.5, -0.5, 1, 1)
  expect(rect.absCenter).toMatchObject(new Point(0.0, 0.0))
})

test('test fromCenter', () => {
  const rect = Rect.fromCenter(Point.zero, 1, 1)
  expect(rect.width).toBe(1)
  expect(rect.height).toBe(1)
  expect(rect.absCenter).toMatchObject(new Point(0.0, 0.0))
  expect(rect.topLeft).toMatchObject(new Point(-0.5, -0.5))
  expect(rect.bottomRight).toMatchObject(new Point(0.5, 0.5))
})