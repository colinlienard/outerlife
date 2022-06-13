import Camera from './Camera';
import EventHandler from './EventHandler';
import Renderer from './Renderer';
import Scene from './Scene';
import { Keys } from './types';

class Game {
  camera;

  environmentCanvas: HTMLCanvasElement;

  debug = false;

  eventHandler;

  paused = false;

  renderer;

  scene;

  terrainCanvas: HTMLCanvasElement;

  constructor(
    terrainCanvas: HTMLCanvasElement,
    environmentCanvas: HTMLCanvasElement
  ) {
    this.terrainCanvas = terrainCanvas;
    this.environmentCanvas = environmentCanvas;
    const terrainContext = terrainCanvas.getContext('2d');
    const environmentContext = environmentCanvas.getContext('2d');

    if (terrainContext && environmentContext) {
      this.scene = new Scene();
      this.scene.buildMap(300, 300);

      this.renderer = new Renderer(
        terrainContext,
        environmentContext,
        this.scene
      );

      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());

      this.camera = new Camera(this.scene, this.renderer.ratio);

      this.eventHandler = new EventHandler();

      this.loop();
    }
  }

  destructor() {
    window.removeEventListener('resize', () => this.resizeCanvas());

    this.scene?.destructor();
    this.camera?.destructor(this.scene as Scene);
    this.eventHandler?.destructor();
  }

  resizeCanvas() {
    this.terrainCanvas.width = window.innerWidth;
    this.terrainCanvas.height = window.innerHeight;

    this.environmentCanvas.width = window.innerWidth;
    this.environmentCanvas.height = window.innerHeight;

    this.renderer?.updateSize();

    this.camera?.updateViewPort(this.renderer?.ratio as number);
  }

  loop() {
    this.scene?.updatePlayer(this.eventHandler?.keys as Keys);
    this.scene?.performCollisions();
    this.scene?.animate();
    this.scene?.ySort();

    this.renderer?.translate(
      this.camera?.getOffsetX() as number,
      this.camera?.getOffsetY() as number
    );
    this.renderer?.clear();
    this.renderer?.render({ debug: this.debug });

    if (!this.paused) {
      window.requestAnimationFrame(() => this.loop());
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
