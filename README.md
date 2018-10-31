# webcanvas_tetris
Simple HTML5-Canvas/JavaScript Tetris game implementation. [Demo](https://Btsan.github.io/webcanvas_tetris/) complete with background effect.

---

This project began as part of another project, but later did not get used. I modified it to be a [playable web demo](https://Btsan.github.io/webcanvas_tetris/). It runs well on desktop and mobile devices.

## background animation

The background animation uses colors interpolated from [value noise](https://en.wikipedia.org/wiki/Value_noise). The implementation uses code I adapted from my [previous project](https://github.com/Btsan/Aurora-Effect) which utilized 2D value noise. Here, I extended my Noise.js file to produce 3D value noise.

## Tetris

The game implementation tries to follow the [standard Tetris guidelines](http://tetris.wikia.com/wiki/Tetris_Guideline). I chose not to implement *wall-kicks* or other player conveniences, since it did not seem necessary for my other project. Score is also not counted, but it would be simple to implement.
