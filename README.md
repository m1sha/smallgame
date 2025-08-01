# Smallgame Lib.

### Base game circle

![getting started output](getting-started.png)

index.html
```html
<html>
  <body>
    <div id="container"></div>

    <script src="index.ts"></script>
  </body>
</html>
```

index.ts
```ts
import { Game, Key, Point, Surface, Time, gameloop, lerp, loadImage } from 'smallgame'

async function main (container: HTMLElement) {
  const GAME_WIDTH       = 400
  const GAME_HEIGHT      = 400
  const HERO_SPEED       = 20
  const { game, screen } = Game.create(GAME_WIDTH, GAME_HEIGHT, container)
  const hero             = await loadImage('hero.png')
  const velocity = Point.zero
  const speed = Point.zero

  hero.rect.center = screen.rect.center

  gameloop(() => {
    const keys = game.key.getPressed()
  
    if (keys[Key.LEFT]) { 
      speed.x = -HERO_SPEED 
    } 
    else
    if (keys[Key.RIGHT]) { 
      speed.x = HERO_SPEED 
    } 
    else {
      speed.x = 0
    }
    
    if (keys[Key.UP]) { 
      speed.y = -HERO_SPEED 
    } 
    else
    if (keys[Key.DOWN]) { 
      speed.y = HERO_SPEED 
    }
    else {
      speed.y = 0
    }
    
    hero.rect.shiftSelf(
      lerp(speed, velocity, Time.deltaTime)
    )

    screen.fill('white')
    screen.blit(hero, hero.rect)
  })
}

main(
  document.getElementById('container')
)
```

### Sprites

hero.ts
```ts
import { Sprite, Point, loadImage } from 'smallgame'

export class Hero extends Sprite {
  position = Point.zero

  async create () {
    this.image = await loadImage('hero.png')
    this.rect = this.image.rect
  }

  protected update(): void {
    this.rect.moveSelf(this.position, 'center-center')
  }

  moveUp()    { hero.position.y -= 5 }
  moveDown()  { hero.position.y += 5 }
  moveLeft()  { hero.position.x -= 5 }
  moveRight() { hero.position.x -= 5 }
}
```

index.ts
```ts
import { Game, gameloop, Key } from 'smallgame'
import { Hero } from './hero'

const GAME_WIDTH  = 800
const GAME_HEIGHT = 800

async function main () {
  const container = document.getElementById('container')
  const { game, screen } = Game.create(GAME_WIDTH, GAME_HEIGHT, container)

  const hero = new Hero()
  await hero.create()
  hero.position = screen.rect.center

  gameloop(() => {
    const keys = game.key.getPressed()
    if (keys[Key.K_A] || keys[Key.LEFT])  { hero.moveLeft() }
    if (keys[Key.K_D] || keys[Key.RIGHT]) { hero.moveRight() }
    if (keys[Key.K_W] || keys[Key.UP])    { hero.moveUp() }
    if (keys[Key.K_S] || keys[Key.DOWN])  { hero.moveDown() }

    screen.fill('white')
    hero.draw(screen)
  })
}

main()
```

### Tile Maps

```ts
import { Game, loadTileMap } from 'smallgame'

const GAME_WIDTH  = 800
const GAME_HEIGHT = 800
const TILE_WIDTH  = 16
const TILE_HEIGHT = 16
const GAP         = 2

async function main() {
  const { screen } = Game.create(GAME_WIDTH, GAME_HEIGHT, container)
  const backgroud = createTileBackgroud()
  const map = await loadTileMap(TILE_WIDTH, TILE_HEIGHT, 'tileset.png')
  map.y = map.x = 0 | GAP / 2

  for (let i = 0; i < map.rows; i++) {
    for (let j = 0; j < map.cols; j++) {
      const image = map.cell(i, j)
      const x = j * (image.width + GAP)
      const y = i * (image.height + GAP)
      
      screen.blit(backgroud, { x, y })
      screen.blit(image, { x, y })
    }  
  }
}

function createTileBackgroud() {
  const rect = new Rect(0, 0, TILE_WIDTH + GAP, TILE_HEIGHT + GAP)
  const sketch = new Sketch()
  sketch.rect({ fill: 'gray' }, rect)
  return sketch.toSurface(rect.width, rect.height)  
}

main()
```

### Animation

```ts
import { Game, Animator, gameloop, setAnimation } from 'smallgame'

export async function main (container: HTMLElement) {
  const GAME_WIDTH  = 400
  const GAME_HEIGHT = 400
  const TILE_WIDTH  = 32
  const TILE_HEIGHT = 32
  const SAMPLE_RATE = 20
  const { screen }  = Game.create(GAME_WIDTH, GAME_HEIGHT, container)

  const animator = new Animator()
  await animator.add('run', setAnimation(TILE_WIDTH, TILE_HEIGHT, SAMPLE_RATE, 'Run_(32x32).png'))
  await animator.add('idle', setAnimation(TILE_WIDTH, TILE_HEIGHT, SAMPLE_RATE, 'Idle_(32x32).png'))

  animator.set('idle')

  gameloop(() => {
    animator.tick()
    const image = animator.image.clone()
    // image.flip('x')

    screen.fill('white')
    screen.blit(image, image.rect)   
  })
```

### Sketchs (Vector graphics)

```ts
import { Game, Sketch } from 'smallgame'

const GAME_WIDTH  = 400
const GAME_HEIGHT = 400
const container  = document.getElementById('container')
const { screen } = Game.create(GAME_WIDTH, GAME_HEIGHT, container)
const heroSketch = Sketch()
heroSketch.roundedrect({ fill: 'tomato' }, new Rect(10, 10, 200, 200), 16)
  
const hero = heroSketch.toSurface()
screen.blit(hero, hero.rect)
```

### WebGL Surfaces



```ts
import { Game, GlSurface } from 'smallgame'

const vertex = `
void main()
{
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 200.0;
}
`
const fragmnet = `
out vec4 fragColor;

void main() {
  fragColor = vec4(0.4, 0.0, 0.5, 1.0);  
}
`

const GAME_WIDTH  = 400
const GAME_HEIGHT = 400
const container  = document.getElementById('container') 
const glSurface = new GlSurface(w, h)
const program = glSurface.createDefaultProgram(vertex, fragmnet)

program.clear()
program.drawArrays()
  
const { screen } = Game.create(w, h, container)
screen.fill('white')
screen.blit(glSurface, glSurface.rect)
```