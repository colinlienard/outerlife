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

  updateSize() {
    this.#ratio = Math.round(window.innerHeight / this.#yPixelsNumber);
    this.#context.imageSmoothingEnabled = false;
  }

  render({ elements }: Scene) {
    elements.forEach((element) => {
      const { sprite, position } = element;
      this.#context.drawImage(
        sprite.image,
        sprite.width * (sprite.column + sprite.currentAnimation.frameStart - 1), // position x in the source image
        sprite.height * sprite.row, // position y in the source image
        sprite.width, // width of the sprite in the source image
        sprite.height, // height of the sprite in the source image
        position.x * this.#ratio, // position x in the canvas
        position.y * this.#ratio, // position y in the canvas
        sprite.width * this.#ratio, // width of the sprite in the canvas
        sprite.height * this.#ratio // height of the sprite in the canvas
      );
    });
  }
}

export default Renderer;
