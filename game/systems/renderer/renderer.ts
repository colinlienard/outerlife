import {
  Animation,
  Collision,
  Position,
  Shadow,
  Sprite,
} from '~~/game/components';
import { Engine } from '~~/game/engine';
import { TILE_SIZE, Y_PIXELS_NUMBER } from '~~/game/globals';
import { Settings } from '~~/game/settings';
import { Terrain } from '~~/game/types';
import { Entity, System } from '~~/game/utils';

type Collisions = {
  environments: Collision[];
  organisms: Collision[];
};

export class Renderer extends System {
  readonly requiredComponents = [Position, Sprite];

  collisions: Collisions = {
    organisms: [],
    environments: [],
  };

  debugContext: CanvasRenderingContext2D;

  engine: Engine;

  offsetX = 0;

  offsetY = 0;

  ratio = 1;

  terrains: Terrain[] = [];

  viewport = {
    width: 0,
    height: 0,
  };

  constructor(
    gameContext: WebGL2RenderingContext,
    debugContext: CanvasRenderingContext2D
  ) {
    super();

    this.engine = new Engine(gameContext);
    this.debugContext = debugContext;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  setEntities(entities: Entity[]) {
    super.setEntities(entities);

    this.entities.forEach((entity) => {
      if (entity.has(Collision)) {
        const collision = entity.get(Collision);

        switch (collision.type) {
          case 'environment':
            this.collisions.environments.push(collision);
            return;
          case 'organism':
            this.collisions.organisms.push(collision);
            return;
          default:
            throw new Error(`Invalid collision type: '${collision.type}'`);
        }
      }
    });
  }

  loadTextures(entities: Entity[]) {
    return new Promise((resolve) => {
      const requiredSources = ['/sprites/dust.png'];

      const entitiesSources = entities.reduce((previous: string[], current) => {
        if (current.has(Sprite)) {
          return [...previous, current.get(Sprite).source];
        }
        return previous;
      }, []);

      const terrainsSources = this.terrains.reduce(
        (previous: string[], current) => {
          if (previous.includes(current.source)) {
            return previous;
          }
          return [...previous, current.source];
        },
        []
      );

      this.engine
        .loadTextures([
          ...requiredSources,
          ...entitiesSources,
          ...terrainsSources,
        ])
        .then(resolve);
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

    this.debugContext.canvas.width = window.innerWidth;
    this.debugContext.canvas.height = window.innerHeight;

    this.ratio = Math.round(window.innerHeight / Y_PIXELS_NUMBER);

    this.viewport.width = window.innerWidth / this.ratio;
    this.viewport.height = window.innerHeight / this.ratio;
  }

  update() {
    this.ySort();
    this.render();

    if (Settings.debug) {
      this.debugContext.clearRect(0, 0, 9999, 9999);
      this.renderCollisions();
      this.renderGrid();
    }
  }

  ySort() {
    this.entities.sort((previous, current) =>
      previous.get(Position).y + previous.get(Sprite).height >
      current.get(Position).y + current.get(Sprite).height
        ? 1
        : -1
    );
  }

  render() {
    // Render terrains
    this.terrains.forEach((terrain) => {
      this.engine.queueRender(
        terrain.source,
        terrain.sourceX,
        terrain.sourceY,
        TILE_SIZE,
        TILE_SIZE,
        terrain.x * this.ratio,
        terrain.y * this.ratio,
        TILE_SIZE * this.ratio,
        TILE_SIZE * this.ratio
      );
    });

    // Render entities
    this.entities.forEach((entity) => {
      const sprite = entity.get(Sprite);
      const position = entity.get(Position);

      // Render shadow
      if (entity.has(Shadow)) {
        const shadow = entity.get(Shadow);
        this.engine.queueRender(
          sprite.source,
          shadow.sourceX,
          shadow.sourceY,
          shadow.width,
          shadow.height,
          Math.floor((position.x + shadow.x) * this.ratio),
          Math.floor((position.y + shadow.y) * this.ratio),
          shadow.width * this.ratio,
          shadow.height * this.ratio
        );
      }

      // Render animated entity
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
      }

      // Render non animated entity
      else {
        this.engine.queueRender(
          sprite.source,
          sprite.sourceX,
          sprite.sourceY,
          sprite.width,
          sprite.height,
          Math.floor(position.x * this.ratio),
          Math.floor(position.y * this.ratio),
          sprite.width * this.ratio,
          sprite.height * this.ratio
        );
      }
    });

    this.engine.render();
  }

  renderCollisions() {
    // Get collisions of environments and organisms
    const { environments, organisms } = this.entities.reduce<{
      environments: Collision[];
      organisms: Collision[];
    }>(
      (previous, current) => {
        if (current.has(Collision) && current.has(Position)) {
          const collision = current.get(Collision);
          const position = current.get(Position);

          const c = {
            ...collision,
            x: collision.x + position.x,
            y: collision.y + position.y,
          };

          if (collision.type === 'environment') {
            previous.environments.push(c);
          } else {
            previous.organisms.push(c);
          }
        }

        return previous;
      },
      {
        environments: [],
        organisms: [],
      }
    );

    this.debugContext.lineWidth = 2;

    // Render environments collisions
    this.debugContext.strokeStyle = 'rgb(255, 0, 0)';
    environments.forEach((environment) => {
      this.debugContext.strokeRect(
        environment.x * this.ratio,
        environment.y * this.ratio,
        environment.width * this.ratio,
        environment.height * this.ratio
      );
    });

    // Render interactions
    // this.debugContext.strokeStyle = 'rgb(0, 0, 255)';
    // interactions.forEach((interaction) => {
    //   this.debugContext.strokeRect(
    //     interaction.x * this.ratio,
    //     interaction.y * this.ratio,
    //     interaction.width * this.ratio,
    //     interaction.height * this.ratio
    //   );
    // });

    // Render organisms collisions
    this.debugContext.strokeStyle = 'rgb(0, 255, 0)';
    organisms.forEach((organism) => {
      this.debugContext.strokeRect(
        organism.x * this.ratio,
        organism.y * this.ratio,
        organism.width * this.ratio,
        organism.height * this.ratio
      );
    });

    this.debugContext.fillStyle = 'transparent';
  }

  renderGrid() {
    this.debugContext.lineWidth = 1;
    this.debugContext.strokeStyle = 'rgba(255, 255, 255, 0.5)';

    for (let index = 0; index < Settings.scene.columns; index += 1) {
      const x = index * TILE_SIZE * this.ratio;
      this.debugContext.beginPath();
      this.debugContext.moveTo(x, 0);
      this.debugContext.lineTo(x, Settings.scene.rows * TILE_SIZE * this.ratio);
      this.debugContext.stroke();
    }

    for (let index = 0; index < Settings.scene.rows; index += 1) {
      const y = index * TILE_SIZE * this.ratio;
      this.debugContext.beginPath();
      this.debugContext.moveTo(0, y);
      this.debugContext.lineTo(
        Settings.scene.columns * TILE_SIZE * this.ratio,
        y
      );
      this.debugContext.stroke();
    }
  }

  setTerrains(terrains: Terrain[]) {
    this.terrains = terrains;
  }
}
