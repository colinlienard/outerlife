import Camera from './Camera';
import EventHandler from './EventHandler';
import Renderer from './Renderer';
import Scene from './Scene';
import { Keys } from './types';

class Game {
  camera;

  debug = false;

  eventHandler;

  fps = 0;

  paused = false;

  renderer;

  scene;

  constructor(gameCanvas: HTMLCanvasElement, debugCanvas: HTMLCanvasElement) {
    const gameContext = gameCanvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
    }) as WebGL2RenderingContext;
    const debugContext = debugCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D;

    this.scene = new Scene();
    this.scene.buildMap(300, 300);

    this.eventHandler = new EventHandler();

    this.renderer = new Renderer(gameContext, debugContext, this.scene);

    this.camera = new Camera(this.scene);
    this.camera.updateViewPort(this.renderer.viewport);
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

    this.camera.updateViewPort(this.renderer.viewport);
  }

  loop(time = 0, oldTime = 0) {
    // Get frames per second
    if (this.debug) {
      this.fps =
        Math.round(
          (1000 / (performance.now() - oldTime) + Number.EPSILON) * 10
        ) / 10;
    }

    if (!this.paused) {
      this.scene.updatePlayer(this.eventHandler.keys as Keys);
      this.scene.performCollisions();
      this.scene.animate();
      this.scene.ySort();
    }

    this.renderer?.translate(
      this.camera?.getCameraX(),
      this.camera?.getCameraY()
    );
    this.renderer.render({ debug: this.debug });

    requestAnimationFrame((timeStamp) => this.loop(timeStamp, time));
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }
}

export default Game;
