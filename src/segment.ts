import { setPoint, type TPoint } from "./point"

export type TSegment = {
  readonly p0: TPoint
  readonly p1: TPoint
}

export class Segment {
  readonly p0: TPoint
  readonly p1: TPoint
  
  constructor (p0: TPoint, p1: TPoint) {
    this.p0 = p0
    this.p1 = p1
  }

  normals () {
    const cx = (this.p1.x + this.p0.x) / 2
    const cy = (this.p1.y + this.p0.y) / 2
    let x1 = this.p0.x
    let y1 = this.p0.y
    let x2 = this.p1.x
    let y2 = this.p1.y
    x1 -= cx; y1 -= cy
    x2 -= cx; y2 -= cy
    
    let xt, yt
    xt =  x1, yt = y1
    x1 = -yt; y1 = xt
    xt =  x2; yt = y2
    x2 = -yt; y2 = xt
    
    x1 += cx; y1 += cy
    x2 += cx; y2 += cy
    return [ 
      new Segment(setPoint(x1, y1), setPoint(cx, cy)),
      new Segment(setPoint(cx, cy), setPoint(x2, y2))
    ]
  }

  static hasPoint (seg: TSegment, p: TPoint) {
    const ab = Segment.distanceSq(seg)
    const ac = Segment.distanceSq({ p0: seg.p0, p1: p })
    const cb = Segment.distanceSq({ p0: p, p1: seg.p1 })
    return (0 | ab)  === (0 | (ac + cb))
  }


  private static distanceSq ({ p0, p1 }: TSegment) {
    const dx = p1.x - p0.x
    const dy = p1.y - p0.y
    return Math.sqrt(dx * dx + dy * dy)
  }
}

export function ray (seg0: TSegment, seg1: TSegment): { point: TPoint | null, intersect: 'parallel' | 'intersect' | 'start-reached' | 'end-reached' | 'no-one' } {
  const eq = ({ p0, p1 }: TSegment) => {
    const a = p1.y - p0.y
    const b = p0.x - p1.x
    const c = a * p0.x + b * p0.y
    return [a, b, c]
  }

  const [a1, b1, c1] = eq(seg0)
  const [a2, b2, c2] = eq(seg1)
  const det = a1 * b2 - a2 * b1

  if (det === 0) return { point: null, intersect: 'parallel' }

  const x = (b2 * c1 - b1 * c2) / det
  const y = (a1 * c2 - a2 * c1) / det

  const right = Segment.hasPoint(seg1, { x, y }) 
  const left = Segment.hasPoint(seg0, { x, y }) 
  
  return { 
    point: setPoint(x, y), 
    intersect: right && left 
      ? 'intersect'
      : right 
      ? 'end-reached'
      : left
      ? 'start-reached'
      : 'no-one'
  }
}

export function setSegment (p0: TPoint, p1: TPoint): TSegment {
  return { p0, p1 }
}

export function points2segments (points: TPoint[], closePath: boolean = false): TSegment[] {
  if (points.length < 2) return []
  const result: TSegment[] = []
  
  for (let i = 1; i < points.length; i++) {
    result.push(setSegment(points[i - 1], points[i]))
  }

  if (closePath && points.length > 2)
    result.push(setSegment(points[points.length - 1], points[0]))

  return result
}
