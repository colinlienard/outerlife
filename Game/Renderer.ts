class Renderer {
  #context: CanvasRenderingContext2D;

  #yPixelsNumber = 200;

  #ratio = 1;

  constructor(context: CanvasRenderingContext2D) {
    this.#context = context;
  }

  render() {
    const image = new Image();
    image.src = 'assets/sprites/player.png';

    const spriteSize = 32;
    this.#context.drawImage(
      image,
      0,
      0,
      spriteSize,
      spriteSize,
      0,
      0,
      spriteSize * this.#ratio,
      spriteSize * this.#ratio
    );
  }

  updateSize() {
    this.#ratio = Math.round(window.innerHeight / this.#yPixelsNumber);
    this.#context.imageSmoothingEnabled = false;
  }
}

export default Renderer;
