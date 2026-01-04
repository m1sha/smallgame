import { Shape } from "../../shapes"
import { drawRect } from "./draw-rect"
import { Surface } from "../../surface"
import { TPoint } from "../../point"
import { drawPolyrect } from "./draw-polyrectangle"
import { drawArrow } from "./draw-arrow"
import { drawArrows } from "./draw-arrows"
import { drawPolygon } from "./draw-polygon"
import { drawPolydots } from "./draw-polydots"
import { drawRoundedRectangle } from "./draw-rounded-rectangle"
import { drawCircle } from "./draw-circle"
import { drawLine } from "./draw-line"
import { drawVLine } from "./draw-vline"
import { drawHLine } from "./draw-hline"
import { drawSegmentLine } from "./draw-segmentline"
import { drawPixel } from "./draw-pixel"
import { drawCubicbezier } from "./draw-cubic-bezier"

const drawerMap: Map<Shape['type'], (shape: any, suface: Surface, shift: TPoint, scale: TPoint) => void> = new Map()

drawerMap.set('rectangle', drawRect)
drawerMap.set('polyrectangle', drawPolyrect)
drawerMap.set('arrow', drawArrow)
drawerMap.set('arrows', drawArrows)
drawerMap.set('polygon', drawPolygon)
drawerMap.set('polydots', drawPolydots)
drawerMap.set('roundedrectangle', drawRoundedRectangle)
drawerMap.set('circle', drawCircle)
drawerMap.set('line', drawLine)
drawerMap.set('vline', drawVLine)
drawerMap.set('hline', drawHLine)
drawerMap.set('segmentline', drawSegmentLine)
drawerMap.set('pixel', drawPixel)
drawerMap.set('cubicbezier', drawCubicbezier)

export { drawerMap }