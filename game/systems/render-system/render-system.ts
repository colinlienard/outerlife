import {
  AnimationComponent,
  CollisionComponent,
  MovementComponent,
  PositionComponent,
  SpriteComponent,
  SpriteLayer,
  SpriteLayersComponent,
} from '~~/game/components';
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

  private readonly debugContext: CanvasRenderingContext2D;

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

  private viewport = {
    width: 0,
    height: 0,
  };

  private movableEntityIds: number[] = [];

  constructor(
    gameContext: WebGL2RenderingContext,
    debugContext: CanvasRenderingContext2D
  ) {
    super();

    this.engine = new Engine(gameContext);
    this.debugContext = debugContext;

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

  private render() {
    // Render terrains
    this.terrainTree
      .get(
        this.offsetX,
        this.offsetY,
        this.viewport.width,
        this.viewport.height
      )
      .forEach(({ terrain }) => {
        this.engine.queueRender(
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

      // Render back sprite layers
      if (entity.has(SpriteLayersComponent)) {
        this.renderSpriteLayers(
          entity.get(SpriteLayersComponent).getBack(),
          position
        );
      }

      // Render animated entity
      if (entity.has(AnimationComponent)) {
        const animation = entity.get(AnimationComponent);
        this.engine.queueRender(
          sprite.source,
          sprite.width * (animation.column + animation.current.frameStart - 1),
          sprite.height * animation.row,
          sprite.width,
          sprite.height,
          Math.floor(position.x * Settings.ratio),
          Math.floor(position.y * Settings.ratio),
          sprite.width * Settings.ratio,
          sprite.height * Settings.ratio
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
          Math.floor(position.x * Settings.ratio),
          Math.floor(position.y * Settings.ratio),
          sprite.width * Settings.ratio,
          sprite.height * Settings.ratio
        );
      }

      // Render front sprite layers
      if (entity.has(SpriteLayersComponent)) {
        this.renderSpriteLayers(
          entity.get(SpriteLayersComponent).getFront(),
          position
        );
      }
    });

    this.engine.render();
  }

  private renderCollision(boxes: CollisionComponent[], color: string) {
    this.debugContext.lineWidth = 2;
    this.debugContext.strokeStyle = color;

    boxes.forEach((box) => {
      this.debugContext.strokeRect(
        box.x * Settings.ratio,
        box.y * Settings.ratio,
        box.width * Settings.ratio,
        box.height * Settings.ratio
      );
    });
  }

  private renderCollisions() {
    // Get collisions of environments and organisms
    const { blue, green, red } = this.getAsArray().reduce<
      Record<string, CollisionComponent[]>
    >(
      (previous, current) => {
        if (current.has(CollisionComponent) && current.has(PositionComponent)) {
          const collision = current.get(CollisionComponent);
          const position = current.get(PositionComponent);

          const c: CollisionComponent = {
            ...collision,
            x: collision.x + position.x,
            y: collision.y + position.y,
          };

          switch (collision.type) {
            case 'environment':
            case 'organism':
              previous.red.push(c);
              break;
            case 'damage':
            case 'interaction':
              previous.blue.push(c);
              break;
            case 'alive':
              previous.green.push(c);
              break;
            default:
              throw new Error(`Invalid collision type: '${collision.type}'`);
          }
        }

        return previous;
      },
      {
        blue: [],
        green: [],
        red: [],
      }
    );

    this.renderCollision(red, 'red');
    this.renderCollision(blue, 'blue');
    this.renderCollision(green, 'lime');
  }

  private renderGrid() {
    this.debugContext.lineWidth = 1;
    this.debugContext.strokeStyle = 'rgba(255, 255, 255, 0.5)';

    for (let index = 0; index < Settings.scene.columns; index += 1) {
      const x = index * Settings.tileSize * Settings.ratio;
      this.debugContext.beginPath();
      this.debugContext.moveTo(x, 0);
      this.debugContext.lineTo(x, Settings.scene.height * Settings.ratio);
      this.debugContext.stroke();
    }

    for (let index = 0; index < Settings.scene.rows; index += 1) {
      const y = index * Settings.tileSize * Settings.ratio;
      this.debugContext.beginPath();
      this.debugContext.moveTo(0, y);
      this.debugContext.lineTo(Settings.scene.width * Settings.ratio, y);
      this.debugContext.stroke();
    }
  }

  private renderSpriteLayers(
    layers: SpriteLayer[],
    position: PositionComponent
  ) {
    layers.forEach((layer) => {
      this.engine.queueRender(
        layer.source,
        layer.sourceX,
        layer.sourceY,
        layer.width,
        layer.height,
        Math.floor((position.x + layer.x) * Settings.ratio),
        Math.floor((position.y + layer.y) * Settings.ratio),
        layer.width * Settings.ratio,
        layer.height * Settings.ratio,
        layer.rotation
      );
    });
  }

  private translate(offsetX: number, offsetY: number) {
    this.offsetX = Math.abs(Math.round(offsetX));
    this.offsetY = Math.abs(Math.round(offsetY));

    this.engine.translate(
      Math.floor(offsetX * Settings.ratio),
      Math.floor(offsetY * Settings.ratio)
    );

    this.debugContext.setTransform(
      1,
      0,
      0,
      1,
      Math.floor(offsetX * Settings.ratio),
      Math.floor(offsetY * Settings.ratio)
    );
  }

  loadTextures(entities: Entity[]) {
    return new Promise((resolve) => {
      const requiredSources = [
        '/sprites/dash-dust.png',
        '/sprites/dust.png',
        '/sprites/items.png',
        '/sprites/slash.png',
      ];

      const entitiesSources = entities.reduce((previous: string[], current) => {
        if (current.has(SpriteComponent)) {
          return [...previous, current.get(SpriteComponent).source];
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

  resize() {
    this.engine.resize();

    this.debugContext.canvas.width = window.innerWidth;
    this.debugContext.canvas.height = window.innerHeight;

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
    this.entityTree = new QuadTree(
      0,
      0,
      Settings.scene.width,
      Settings.scene.height
    );
  }

  setTerrains(terrains: Terrain[]) {
    this.terrains = terrains;
    this.terrainTree = new QuadTree(
      0,
      0,
      Settings.scene.width,
      Settings.scene.height
    );
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
    this.render();

    if (Settings.debug) {
      this.debugContext.clearRect(
        0,
        0,
        Settings.scene.width * Settings.ratio,
        Settings.scene.height * Settings.ratio
      );
      this.renderCollisions();
      this.renderGrid();
    }
  }
}
