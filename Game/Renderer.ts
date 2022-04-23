import Scene from './Scene';

class Renderer {
  #context: CanvasRenderingContext2D;

  #yPixelsNumber = 200;

  #ratio = 1;

  constructor(context: CanvasRenderingContext2D) {
    this.#context = context;
  }

  clear() {
    this.#context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  render({ elements }: Scene) {
    elements.forEach(({ sprite }) => {
      this.#context.drawImage(
        sprite.image,
        sprite.width * (sprite.column + sprite.currentAnimation.frameStart - 1), // position x in the source image
        sprite.height * sprite.row, // position y in the source image
        sprite.width, // width of the sprite in the source image
        sprite.height, // height of the sprite in the source image
        0, // position x in the canvas
        0, // position y in the canvas
        sprite.width * this.#ratio, // width of the sprite in the canvas
        sprite.height * this.#ratio // height of the sprite in the canvas
      );
    });
  }

  updateSize() {
    this.#ratio = Math.round(window.innerHeight / this.#yPixelsNumber);
    this.#context.imageSmoothingEnabled = false;
  }
}

export default Renderer;
