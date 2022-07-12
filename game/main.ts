import { Animator, Mover, Renderer } from './systems';
import { Player } from './organisms';
import { Entity } from './utils';

export class Game {
  entities: Entity[] = [];

  renderer: Renderer;

  animator: Animator;

  mover: Mover;

  constructor(gameContext: WebGL2RenderingContext) {
    this.entities.push(new Player());

    this.renderer = new Renderer(this.entities, gameContext);
    this.animator = new Animator(this.entities);
    this.mover = new Mover(this.entities);

    this.renderer.loadTextures(this.entities);

    this.loop();
  }

  loop() {
    this.mover.update();
    this.animator.update();
    this.renderer.update();

    requestAnimationFrame(() => this.loop());
  }
}
