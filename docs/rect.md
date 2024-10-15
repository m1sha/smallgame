# Rect (Rectangle)

Smallgame uses Rect objects to store and manipulate rectangular areas. A Rect can be created from a combination of left, top, width, and height values. Rects can also be created either from like "Rect" object or static use methods like Rect.size, Rect.zero and etc.

The Rect functions that change the position or size of a Rect return a new copy of the Rect with the affected changes. The original Rect is not modified. Some methods have an alternate "self" version that returns same object and affects the original Rect. These methods are denoted with the "self" suffix.

## Methods

### **clone()**

copy the rectangle
```
copy() -> Rect
```
Returns a new rectangle having the same position and size as the original.

### **equals()**
test that two rectangles are equal
```
equals(rect: Rect) -> boolean
```
Returns true if both rectangles are equal


### **overlaps()**

test if two rectangles overlap
```
overlaps (rect: Rect) -> boolean
```
Returns true if any portion of either rectangle overlap


### **contains()**

test if one rectangle is inside another
```
contains (rect: Rect) -> boolean
```
Returns true if a transmitted rectangle inside the source rectangle

### **outline()**

create a new rectangle with specified indent
```
outline (indent: number) -> Rect
outline (top: number, left: number, bottom: number, right: number) -> Rect
```

NOTE: The positive value indents inwards, and a negative value indents outwards

### **move()**

create a new rectangle and moves it to the specified position
```
move (point: TPoint, pivote?: Pivote) -> Rect
move (x: number, y: number, pivote?: Pivote) -> Rect
```

Returns new rectangle

### **moveSelf()**

move the rectangle it to the specified position
```
moveSelf (point: TPoint, pivote?: Pivote) -> Rect
moveSelf (x: number, y: number, pivote?: Pivote) -> Rect
```

Returns the original rectangle

### **shift()**

### **shiftSelf()**

### **resize()**

### **resizeSelf()**

### **union()**

### **unionSelf()**

### **rotate()**

create a new PolyRect object and rotate it to the specified angle
```
rotate (angle: number, pivot?: number | TPoint) -> PolyRect
```

NOTE angle in degress

## Static Methods

### **zero()**
### **from()**
### **size()**
### **fromTwoPoints()**

