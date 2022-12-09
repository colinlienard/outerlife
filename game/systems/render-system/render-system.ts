import {
  AnimationComponent,
  CollisionComponent,
  MovementComponent,
  PositionComponent,
  SpriteComponent,
  LayersComponent,
  SpriteLayer,
  GlowLayer,
  ParticlesComponent,
} from '~~/game/components';
import { Particle } from '~~/game/components/particles-component/types';
import { Engine } from '~~/game/engine';
import {
  Box,
  Entity,
  QuadTree,
  Settings,
  System,
  Terrain,
} from '~~/game/utils';

interface EntityLeaf extends Box {
  id: number;
  entity: Entity;
}

interface TerrainLeaf extends Box {
  terrain: Terrain;
  id: number;
}

export class RenderSystem extends System {
  protected readonly requiredComponents = [PositionComponent, SpriteComponent];

  private readonly engine: Engine;

  private entityTree: QuadTree<EntityLeaf> = new QuadTree(
    0,
    0,
    Settings.scene.width,
    Settings.scene.height
  );

  private offsetX = 0;

  private offsetY = 0;

  private terrains: Terrain[] = [];

  private terrainTree: QuadTree<TerrainLeaf> = new QuadTree(
    0,
    0,
    Settings.scene.width,
    Settings.scene.height
  );

  private colorCorrection: [number, number, number, number] = [0, 0, 0, 0];

  private viewport = {
    width: 0,
    height: 0,
  };

  private movableEntityIds: number[] = [];

  constructor(canvas: HTMLCanvasElement) {
    super();

    this.engine = new Engine(canvas);

    this.resize();
  }

  private getSortedEntities() {
    const entities = this.entityTree
      .get(
        this.offsetX,
        this.offsetY,
        this.viewport.width,
        this.viewport.height
      )
      .map((leaf) => leaf.entity);
    return entities.sort((previous, current) =>
      previous.get(PositionComponent).y + previous.get(SpriteComponent).height >
      current.get(PositionComponent).y + current.get(SpriteComponent).height
        ? 1
        : -1
    );
  }

  private queueRenders() {
    // Render terrains
    this.terrainTree
      .get(
        this.offsetX,
        this.offsetY,
        this.viewport.width,
        this.viewport.height
      )
      .forEach(({ terrain }) => {
        this.engine.queueTextureRender(
          terrain.source,
          terrain.sourceX,
          terrain.sourceY,
          Settings.tileSize,
          Settings.tileSize,
          terrain.x * Settings.ratio,
          terrain.y * Settings.ratio,
          Settings.tileSize * Settings.ratio,
          Settings.tileSize * Settings.ratio
        );
      });

    // Render entities
    this.getSortedEntities().forEach((entity) => {
      const sprite = entity.get(SpriteComponent);
      const position = entity.get(PositionComponent);
      const layers = entity.get(LayersComponent);

      // Render back sprite layers
      if (layers) {
        this.renderSpriteLayers(layers.getBackSprites(), position);
      }

      // Render animated entity
      if (entity.has(AnimationComponent)) {
        const animation = entity.get(AnimationComponent);
        this.engine.queueTextureRender(
          sprite.source,
          sprite.width * (animation.column + animation.current.frameStart - 1),
          sprite.height * animation.row,
          sprite.width,
          sprite.height,
          Math.floor(position.x * Settings.ratio),
          Math.floor(position.y * Settings.ratio),
          sprite.width * Settings.ratio,
          sprite.height * Settings.ratio,
          0,
          sprite.hit
        );

        // Render non animated entity
      } else {
        this.engine.queueTextureRender(
          sprite.source,
          sprite.sourceX,
          sprite.sourceY,
          sprite.width,
          sprite.height,
          Math.floor(position.x * Settings.ratio),
          Math.floor(position.y * Settings.ratio),
          sprite.width * Settings.ratio,
          sprite.height * Settings.ratio
        );
      }

      if (layers) {
        // Render front sprite layers
        this.renderSpriteLayers(layers.getFrontSprites(), position);

        // Render glow
        this.renderGlowLayers(layers.getGlow(), position);
      }

      // Render particles
      if (entity.has(ParticlesComponent)) {
        const particles = entity.get(ParticlesComponent);
        this.renderParticles(particles.list, particles.color);
      }
    });
  }

  private renderCollision({ x, y, width, height }: Box, color: number) {
    this.engine.queueTextureRender(
      '/sprites/guidelines.png',
      color,
      0,
      1,
      1,
      x * Settings.ratio,
      y * Settings.ratio,
      width * Settings.ratio,
      2
    );
    this.engine.queueTextureRender(
      '/sprites/guidelines.png',
      color,
      0,
      1,
      1,
      x * Settings.ratio,
      (y + height) * Settings.ratio,
      width * Settings.ratio,
      2
    );
    this.engine.queueTextureRender(
      '/sprites/guidelines.png',
      color,
      0,
      1,
      1,
      x * Settings.ratio,
      y * Settings.ratio,
      2,
      height * Settings.ratio
    );
    this.engine.queueTextureRender(
      '/sprites/guidelines.png',
      color,
      0,
      1,
      1,
      (x + width) * Settings.ratio,
      y * Settings.ratio,
      2,
      height * Settings.ratio
    );
  }

  private renderAllCollisions() {
    this.getAsArray().forEach((entity) => {
      if (entity.has(CollisionComponent)) {
        const { x, y } = entity.get(PositionComponent);
        const { collisions } = entity.get(CollisionComponent);
        collisions.forEach((collision) => {
          const box = { ...collision, x: collision.x + x, y: collision.y + y };
          switch (collision.type) {
            case 'hitbox':
            case 'environment':
              this.renderCollision(box, 5);
              break;
            case 'interaction':
              this.renderCollision(box, 7);
              break;
            case 'damage-player':
            case 'damage-ai':
              this.renderCollision(box, 3);
              break;
            case 'player-hurtbox':
            case 'ai-hurtbox':
              this.renderCollision(box, 4);
              break;
            default:
              break;
          }
        });
      }
    });
  }

  private renderGrid() {
    for (let index = 0; index < Settings.scene.columns; index += 1) {
      const x = index * Settings.tileSize * Settings.ratio;
      this.engine.queueTextureRender(
        '/sprites/guidelines.png',
        2,
        0,
        1,
        1,
        x,
        0,
        1,
        Settings.scene.height * Settings.ratio
      );
    }

    for (let index = 0; index < Settings.scene.rows; index += 1) {
      const y = index * Settings.tileSize * Settings.ratio;
      this.engine.queueTextureRender(
        '/sprites/guidelines.png',
        2,
        0,
        1,
        1,
        0,
        y,
        Settings.scene.width * Settings.ratio,
        1
      );
    }
  }

  private renderSpriteLayers(
    layers: SpriteLayer[],
    position: PositionComponent
  ) {
    layers.forEach((layer) => {
      this.engine.queueTextureRender(
        layer.source,
        layer.sourceX,
        layer.sourceY,
        layer.width,
        layer.height,
        Math.floor((position.x + layer.data.x) * Settings.ratio),
        Math.floor((position.y + layer.data.y) * Settings.ratio),
        layer.width * Settings.ratio,
        layer.height * Settings.ratio,
        layer.data.rotation
      );
    });
  }

  private renderGlowLayers(layers: GlowLayer[], position: PositionComponent) {
    layers.forEach((layer) => {
      this.engine.queueGlowRender(
        layer.color,
        layer.opacity,
        Math.floor((position.x + layer.data.x) * Settings.ratio),
        Math.floor((position.y + layer.data.y) * Settings.ratio),
        layer.size * Settings.ratio,
        true
      );
    });
  }

  private renderParticles(particles: Particle[], color: number) {
    particles.forEach((particle) => {
      this.engine.queueTextureRender(
        '/sprites/palette.png',
        color,
        0,
        1,
        1,
        particle.x * Settings.ratio,
        particle.y * Settings.ratio,
        Settings.ratio,
        Settings.ratio
      );
    });
  }

  private renderColorCorrection() {
    this.engine.queueGlowRender(
      [
        this.colorCorrection[0],
        this.colorCorrection[1],
        this.colorCorrection[2],
      ],
      this.colorCorrection[3],
      0,
      0,
      (Settings.scene.width > Settings.scene.height
        ? Settings.scene.width
        : Settings.scene.height) * Settings.ratio,
      false
    );
  }

  private translate(offsetX: number, offsetY: number) {
    this.offsetX = offsetX < 0 ? Math.abs(Math.round(offsetX)) : 0;
    this.offsetY = offsetY < 0 ? Math.abs(Math.round(offsetY)) : 0;

    this.engine.translate(
      Math.floor(offsetX * Settings.ratio),
      Math.floor(offsetY * Settings.ratio)
    );
  }

  loadTextures() {
    return new Promise((resolve) => {
      const requiredSources = [
        '/sprites/dash-dust.png',
        '/sprites/dust.png',
        '/sprites/items.png',
        '/sprites/slash.png',
        '/sprites/guidelines.png',
        '/sprites/palette.png',
        '/sprites/impact.png',
      ];

      const entitiesSources = Array.from(this.get().values()).reduce(
        (previous: string[], current) => {
          const sprite = current.get(SpriteComponent);
          if (sprite && !previous.includes(sprite.source)) {
            return [...previous, sprite.source];
          }
          return previous;
        },
        []
      );

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

  resize() {
    this.engine.resize();

    Settings.ratio = Math.round(window.innerHeight / Settings.yPixelsNumber);

    this.viewport.width = window.innerWidth / Settings.ratio;
    this.viewport.height = window.innerHeight / Settings.ratio;
  }

  add(entity: Entity) {
    super.add(entity);

    if (entity.has(MovementComponent)) {
      this.movableEntityIds.push(entity.id);
    }

    this.addToEntityTree(entity);
  }

  addToEntityTree(entity: Entity) {
    const { x, y } = entity.get(PositionComponent);
    const { width, height } = entity.get(SpriteComponent);
    this.entityTree.add({
      x,
      y,
      width,
      height,
      entity,
      id: entity.id,
    });
  }

  delete(id: number) {
    super.delete(id);

    if (this.movableEntityIds.includes(id)) {
      this.movableEntityIds.splice(this.movableEntityIds.indexOf(id), 1);
    }

    this.entityTree.delete(id);
  }

  reset() {
    this.entityTree.reset(0, 0, Settings.scene.width, Settings.scene.height);
  }

  setColorCorrection(colorCorrection: [number, number, number, number]) {
    this.colorCorrection = colorCorrection;
  }

  setTerrains(terrains: Terrain[]) {
    this.terrains = terrains;
    this.terrainTree.reset(0, 0, Settings.scene.width, Settings.scene.height);
    this.terrains.forEach((terrain, index) => {
      this.terrainTree.add({
        x: terrain.x,
        y: terrain.y,
        width: Settings.tileSize,
        height: Settings.tileSize,
        terrain,
        id: index,
      });
    });
  }

  update() {
    // Update movable entities in the tree
    this.movableEntityIds.forEach((id) => {
      this.entityTree.delete(id);
      const entity = this.get().get(id);
      if (entity) {
        this.addToEntityTree(entity);
      }
    });

    this.translate(Settings.cameraOffset.x, Settings.cameraOffset.y);
    this.queueRenders();
    this.renderColorCorrection();

    if (Settings.debug) {
      this.renderAllCollisions();
      this.renderGrid();
    }

    this.engine.render();
  }
}
