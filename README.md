# Smallgame Lib.

### Base game circle

index.html
```html
<html>
  <body>
    <div id="container"></div>

    <script src="index.js"></script>
  </body>
</html>
```

index.js
```ts
import { Game, Surface, Sketch, Rect } from 'smallgame'

const game = new Game()
const screen = game.init(800, 800, document.getElementById("container"))

const hero = new Surface(100, 100)
const sketch = new Sketch()
sketch.rect({ fill: "green" }, new Rect(0, 0, 100, 100))
sketch.draw(hero)

let x = 0
let y = 0
game.loop(() => {
  const keys = game.key.getPressed()
  
  if (keys[Key.K_A]) { x -= 0.5 }
  if (keys[Key.K_D]) { x += 0.5 }
  if (keys[Key.K_W]) { y -= 0.5 }
  if (keys[Key.K_A]) { y += 0.5 }

  screen.clear()
  screen.blit(hero, new Rect(0 | x, 0 | y, hero.width, hero.height))
})

```

### Show an image

```ts
import { Game, loadImage } from 'smallgame'

async function main () {
  const game = new Game()
  const screen = game.init(1024, 800, document.getElementById("container"))
  
  const surface = await loadImage('image.jpg')

  screen.clear()
  screen.blit(surface, surface.rect)
}

main()

```

### Works with sprites

hero.ts
```ts
import { Sprite, loadImage } from 'smallgame'

export class Hero extends Sprite {
  x = 0
  y = 0

  async create () {
    this.image = await loadImage('hero.png')
    this.rect = this.image.rect
  }

  update(): void {
    this.rect.x = 0 | this.x - this.rect.width / 2
    this.rect.y = 0 | this.y - this.rect.height / 2
  }
}
```

index.ts
```ts
import { Game, Key } from 'smallgame'
import { Hero } from './hero'

async function main () {
  const game = new Game()
  const screen = game.init(800, 800, container.value!)

  const hero = new Hero()
  await hero.create()
  hero.x = screen.width / 2
  hero.y = screen.width / 2

  game.loop(() => {
    const keys = game.key.getPressed()
    if (keys[Key.K_A]) { hero.x -= 1 }
    if (keys[Key.K_D]) { hero.x += 1 }
    if (keys[Key.K_W]) { hero.y -= 1 }
    if (keys[Key.K_S]) { hero.y += 1 }

    screen.fill('white')
    hero.draw(screen)
  })
}

main()
```

### Tile Maps

```ts
async function main() {
  const game = new Game()
  const screen = game.init(320, 320, container.value!)
  
  const tileWidth = 16
  const tileHeight = 16
  const map = await loadTileMap(tileWidth, tileHeight, 'Tileset.png')
  const gap = 2
  map.y = map.x = 0 | gap / 2
  
  const strokeRect = new Rect(0, 0, tileWidth + gap, tileHeight + gap)
  const stroke = new Sketch()
  stroke.rect({ fill: 'gray' }, strokeRect)

  const strokeSurf = new Surface(strokeRect.width, strokeRect.height)
  stroke.draw(strokeSurf)

  for (let i = 0; i < map.rows; i++) {
    for (let j = 0; j < map.cols; j++) {
      const image = map.cell(i, j)
      const x = j * (image.width + gap)
      const y = i * (image.height + gap)
      
      screen.blit(strokeSurf, new Rect(x, y, strokeSurf.width, strokeSurf.height))
      screen.blit(image, new Rect(x, y, image.width, image.height))
    }  
  }

  screen.zoom(2)
}

main()
```
