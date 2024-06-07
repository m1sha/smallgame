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
