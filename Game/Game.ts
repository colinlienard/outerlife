import Renderer from './Renderer';

class Game {
  #canvas: HTMLCanvasElement;

  #renderer;

  constructor(canvas: HTMLCanvasElement) {
    this.#canvas = canvas;
    const context = canvas.getContext('2d');
    if (context) {
      this.#renderer = new Renderer(context);

      this.#resizeCanvas();
      window.addEventListener('resize', () => this.#resizeCanvas());

      this.#loop();
    }
  }

  #resizeCanvas() {
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;
    this.#renderer?.updateSize();
  }

  #loop() {
    this.#renderer?.render();

    window.requestAnimationFrame(() => this.#loop());
  }
}

export default Game;
