import Camera from './Camera';
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

    const context = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
    }) as WebGL2RenderingContext;

    this.scene = new Scene();
    this.scene.buildMap(300, 300);

    this.eventHandler = new EventHandler();

    this.renderer = new Renderer(context, this.scene);

    this.camera = new Camera(this.scene);
    this.camera.init(this.scene);

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.loop();
  }

  destructor() {
    window.removeEventListener('resize', () => this.resize());

    this.scene.destructor();
    this.camera.destructor(this.scene as Scene);
    this.eventHandler.destructor();
  }

  resize() {
    this.renderer.resize();

    this.camera.updateViewPort(
      this.renderer.viewport.width,
      this.renderer.viewport.height
    );
  }

  loop(time = 0, oldTime = 0) {
    // Get frames per second
    if (this.debug) {
      this.fps =
        Math.round(
          (1000 / (performance.now() - oldTime) + Number.EPSILON) * 10
        ) / 10;
    }

    this.scene.updatePlayer(this.eventHandler.keys as Keys);
    this.scene.performCollisions();
    this.scene.animate();
    this.scene.ySort();

    this.renderer?.translate(
      this.camera?.getOffsetX() as number,
      this.camera?.getOffsetY() as number
    );
    this.renderer.render({ debug: this.debug });

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
