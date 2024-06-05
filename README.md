# Smallgame Lib.

Base game circle

```ts

const game = new Game()
const screen = game.init(1024, 800, document.getElementById("container"))

const surface = new Surface(100, 100)
const actor = new Sketch()
actor.rect({ fill: "green" }, new Rect(0, 0, 100, 100))
actor.update(surface)

let x = 0
let y = 0
game.loop(() => {
  const keys = game.key.getPressed()
  
  if (keys[Key.K_A]) {
    x-=0.5
  }

  if (keys[Key.K_D]) {
    x+=0.5
  }

  if (keys[Key.K_W]) {
    y-=0.5
  }

  if (keys[Key.K_A]) {
    y+=0.5
  }

  screen.clear()
  screen.blit(surface, new Rect(0 | x, 0 | y, surface.width, surface.height))
})

```

Show an image

```ts
async function main () {
  const game = new Game()
  const screen = game.init(1024, 800, document.getElementById("container"))

  const assets = new Assets()
  const surface = await assets.loadImage('image.jpg')

  screen.clear()
  screen.blit(surface, surface.rect)
}

```
