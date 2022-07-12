import { Animator, Mover, Renderer } from './systems';
import { Player } from './organisms';
import { ECS } from './utils';

export class Game extends ECS {
  constructor(gameContext: WebGL2RenderingContext) {
    super();

    this.add(new Mover());
    this.add(new Animator());
    this.add(new Renderer(gameContext));

    this.entities.push(new Player());

    this.setSystemsEntities();

    (async () => {
      await this.get(Renderer).loadTextures(this.entities);
      this.loop();
    })();
  }

  loop() {
    this.update();

    requestAnimationFrame(() => this.loop());
  }

  setSystemsEntities() {
    this.systems.forEach((system) => {
      system.setEntities(this.entities);
    });
  }
}
