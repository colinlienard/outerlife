import Camera from './Camera';
import State from './State';
import EventHandler from './EventHandler';
import Renderer from './Renderer';
import Scene from './Scene';
import { Keys } from './types';

class Game {
  camera;

  canvas: HTMLCanvasElement;

  debug = false;

  eventHandler;

  fps = 0;

  paused = false;

  renderer;

  scene;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    const context = canvas.getContext('webgl2') as WebGL2RenderingContext;
    State.context = context;

    this.scene = new Scene();
    this.scene.buildMap(0, 0);

    this.eventHandler = new EventHandler();

    this.renderer = new Renderer(context, this.scene);

    this.camera = new Camera(this.scene);
    this.camera.init(this.scene);

    this.loop(0, 0);
  }

  destructor() {
    window.removeEventListener('resize', () => this.resizeCanvas());

    this.scene?.destructor();
    // this.camera?.destructor(this.scene as Scene);
    this.eventHandler?.destructor();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.renderer?.updateSize();

    // this.camera?.updateViewPort(
    //   this.renderer?.viewPortWidth as number,
    //   this.renderer?.viewPortHeight as number
    // );
  }

  loop(time = 0, oldTime = 0) {
    // Get frames per second
    if (this.debug) {
      this.fps =
        Math.round(
          (1000 / (performance.now() - oldTime) + Number.EPSILON) * 10
        ) / 10;
    }

    this.scene?.updatePlayer(this.eventHandler?.keys as Keys);
    this.scene?.performCollisions();
    this.scene?.animate();
    this.scene?.ySort();

    // this.renderer?.translate(
    //   this.camera?.getOffsetX() as number,
    //   this.camera?.getOffsetY() as number
    // );
    this.renderer?.clear();
    this.renderer?.render({ debug: this.debug });

    if (!this.paused) {
      window.requestAnimationFrame((timeStamp) => this.loop(timeStamp, time));
    }
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this.loop();
  }
}

export default Game;
