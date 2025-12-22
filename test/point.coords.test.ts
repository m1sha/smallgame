import { Point } from "../src/point"
import { Size } from "../src/size"

test('uv coords', () => {
    const size = new Size(1024, 768)
    const point = new Point(0, 0)
    const uv = point.uv(size)
    expect(uv.screen(size, 'uv')).toStrictEqual(point)
})

test('math coords', () => {
    const size = new Size(1024, 768)
    const point = new Point(0, 0)
    const math = point.math(size)
    expect(math.screen(size, 'math')).toStrictEqual(point)
})