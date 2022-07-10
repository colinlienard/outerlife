import { Renderer } from './core';
import { Player } from './organisms';
import { Entity } from './utils';

export class Game {
  entities: Entity[] = [];

  renderer: Renderer;

  constructor(gameContext: WebGL2RenderingContext) {
    this.renderer = new Renderer(gameContext);

    this.entities.push(new Player());

    this.renderer.loadTextures(this.entities);

    this.loop();
  }

  loop() {
    this.entities.forEach((entity) => {
      entity.update();
    });

    this.renderer.render(this.entities);

    requestAnimationFrame(() => this.loop());
  }
}
