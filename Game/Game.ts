import EventHandler from './EventHandler';
import Renderer from './Renderer';
import Scene from './Scene';
import { Keys } from './types';

class Game {
  #canvas: HTMLCanvasElement;

  #eventHandler;

  #renderer;

  #scene;

  constructor(canvas: HTMLCanvasElement) {
    this.#canvas = canvas;
    const context = canvas.getContext('2d');
    if (context) {
      this.#renderer = new Renderer(context);

      this.#resizeCanvas();
      window.addEventListener('resize', () => this.#resizeCanvas());

      this.#scene = new Scene();

      this.#eventHandler = new EventHandler();

      this.#loop();
    }
  }

  #resizeCanvas() {
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;
    this.#renderer?.updateSize();
  }

  #loop() {
    this.#scene?.updatePlayer(this.#eventHandler?.keys as Keys);
    this.#scene?.animate();

    this.#renderer?.clear();
    this.#renderer?.render(this.#scene as Scene);

    window.requestAnimationFrame(() => this.#loop());
  }
}

export default Game;
