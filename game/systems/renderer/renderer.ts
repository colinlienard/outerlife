import { Animation, Position, Sprite } from '~~/game/components';
import { Engine } from '~~/game/engine';
import { Y_PIXELS_NUMBER } from '~~/game/globals';
import { Entity, System } from '~~/game/utils';

export class Renderer extends System {
  readonly requiredComponents = [Sprite];
  // debugContext: CanvasRenderingContext2D;

  engine: Engine;

  offsetX = 0;

  offsetY = 0;

  ratio = 1;

  viewport = {
    width: 0,
    height: 0,
  };

  constructor(entities: Entity[], gameContext: WebGL2RenderingContext) {
    super();
    super.setEntities(entities);

    this.engine = new Engine(gameContext);

    this.resize();
  }

  loadTextures(entities: Entity[]) {
    return new Promise((resolve) => {
      const sprites: Sprite[] = entities.reduce<Sprite[]>(
        (previous, current) => {
          if (current.has(Sprite)) {
            return [...previous, current.get(Sprite)];
          }
          return previous;
        },
        []
      );

      const requiredSources = ['/sprites/dust.png'];
      const sources = sprites.reduce((previous: string[], current) => {
        if (previous.includes(current.source)) {
          return previous;
        }
        return [...previous, current.source];
      }, []);

      this.engine.loadTextures([...requiredSources, ...sources]).then(resolve);
    });
  }

  isVisible(x: number, y: number, width: number, height: number) {
    return (
      x + width > this.offsetX &&
      x < this.offsetX + this.viewport.width &&
      y + height + 10 > this.offsetY &&
      y - 10 < this.offsetY + this.viewport.height
    );
  }

  resize() {
    this.engine.resize();

    // this.debugContext.canvas.width = window.innerWidth;
    // this.debugContext.canvas.height = window.innerHeight;

    this.ratio = Math.round(window.innerHeight / Y_PIXELS_NUMBER);

    this.viewport.width = window.innerWidth / this.ratio;
    this.viewport.height = window.innerHeight / this.ratio;
  }

  updateEntity(entity: Entity) {
    const sprite = entity.get(Sprite);
    const position = entity.get(Position);

    if (entity.has(Animation)) {
      const animator = entity.get(Animation);
      this.engine.queueRender(
        sprite.source,
        sprite.width *
          (animator.column + animator.currentAnimation.frameStart - 1),
        sprite.height * animator.row,
        sprite.width,
        sprite.height,
        Math.floor(position.x * this.ratio),
        Math.floor(position.y * this.ratio),
        sprite.width * this.ratio,
        sprite.height * this.ratio
      );
    } else {
      this.engine.queueRender(
        sprite.source,
        sprite.sourceX,
        sprite.sourceY,
        sprite.width,
        sprite.width,
        Math.floor(position.x * this.ratio),
        Math.floor(position.y * this.ratio),
        sprite.width * this.ratio,
        sprite.width * this.ratio
      );
    }

    this.engine.render();
  }
}
