import { AnimationComponent, SpriteComponent } from '~~/game/components';
import { environmentsIndex, organismsIndex, terrainsIndex } from '~~/game/data';
import { Engine } from '~~/game/engine';
import {
  Map,
  MapEntity,
  MapItemType,
  MapTerrain,
  Settings,
} from '~~/game/utils';

type EditorEntity = MapEntity & { type: MapItemType };

export class Editor {
  private readonly engine: Engine;

  private terrains: MapTerrain[] = [];

  private entities: EditorEntity[] = [];

  private ratio: number;

  private showGrid: boolean = true;

  private rows: number;

  private columns: number;

  constructor(
    canvas: HTMLCanvasElement,
    rows: number,
    columns: number,
    ratio: number
  ) {
    // Setup rendering context
    const options = {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    };
    const context = canvas.getContext(
      'webgl2',
      options
    ) as WebGL2RenderingContext;
    this.engine = new Engine(context);
    this.engine.resize();

    this.ratio = ratio;
    this.rows = rows;
    this.columns = columns;

    this.terrains = [...new Array(rows * columns)].map(() => null);

    const spritesFolder = import.meta.glob('/public/sprites/*.png');
    const sources = Object.keys(spritesFolder).map((source) =>
      source.replace('/public', '')
    );
    this.engine.loadTextures(sources).then(() => {
      this.render();
    });
  }

  placeTerrain(column: number, row: number, value: number | null) {
    // Avoid placing terrain out of the map
    if (column > this.columns - 1) {
      return;
    }

    // Update map
    const index = row * this.columns + column;
    this.terrains = this.terrains.map((v, i) => (i === index ? value : v));
  }

  placeEntity(x: number, y: number, constructorId: number, type: MapItemType) {
    const index = type === 'environment' ? environmentsIndex : organismsIndex;
    const { width, height } = new index[constructorId]().get(SpriteComponent);
    this.entities.push({
      x: x - width / 2,
      y: y - height / 2,
      constructorId,
      type,
    });
    this.entities.sort((a, b) => {
      const indexA =
        type === 'environment' ? environmentsIndex : organismsIndex;
      const indexB =
        type === 'environment' ? environmentsIndex : organismsIndex;
      return a.y + new indexA[a.constructorId]().get(SpriteComponent).height >
        b.y + new indexB[b.constructorId]().get(SpriteComponent).height
        ? 1
        : -1;
    });
  }

  selectEntity(x: number, y: number, type: MapItemType) {
    for (const entity of this.entities) {
      if (entity.type === type) {
        const index =
          type === 'environment' ? environmentsIndex : organismsIndex;
        const sprite = new index[entity.constructorId]().get(SpriteComponent);
        if (
          x > entity.x &&
          x < entity.x + sprite.width &&
          y > entity.y &&
          y < entity.y + sprite.height
        ) {
          return {
            x: entity.x,
            y: entity.y,
            index: this.entities.indexOf(entity),
          };
        }
      }
    }

    return null;
  }

  updateEntity(x: number, y: number, index: number) {
    for (let i = 0; i < this.entities.length; i += 1) {
      if (i === index) {
        this.entities[index] = { ...this.entities[index], x, y };
        return;
      }
    }
  }

  deleteEntity(index: number) {
    this.entities = this.entities.filter((_, i) => i !== index);
  }

  getMap(): Map {
    return {
      rows: this.rows,
      columns: this.columns,
      terrains: this.terrains,
      environments: this.entities.filter(
        (entity) => entity.type === 'environment'
      ),
      organisms: this.entities.filter((entity) => entity.type === 'organism'),
    };
  }

  setMapData(map: Map) {
    this.terrains = map.terrains;
    const environments = map.environments.map((environment) => ({
      ...environment,
      type: 'environment',
    })) as EditorEntity[];
    const organisms = map.organisms.map((organism) => ({
      ...organism,
      type: 'organism',
    })) as EditorEntity[];
    this.entities = [...environments, ...organisms];
  }

  render() {
    this.engine.clear();

    // Render terrains
    this.terrains.forEach((item, index) => {
      if (item === null) {
        return;
      }

      const [source, x, y] = terrainsIndex[item];
      const column = index % this.columns;
      const row = Math.floor(index / this.columns);

      this.engine.renderTexture(
        source,
        x,
        y,
        Settings.tileSize,
        Settings.tileSize,
        column * Settings.tileSize * this.ratio,
        row * Settings.tileSize * this.ratio,
        Settings.tileSize * this.ratio,
        Settings.tileSize * this.ratio
      );
    });

    // Render entitiess
    this.entities.forEach(({ x, y, constructorId, type }) => {
      const index = type === 'environment' ? environmentsIndex : organismsIndex;
      const entity = new index[constructorId]();
      const { source, sourceX, sourceY, width, height } =
        entity.get(SpriteComponent);
      const animation = entity.get(AnimationComponent);

      this.engine.renderTexture(
        source,
        animation ? 0 : sourceX,
        animation ? height : sourceY,
        width,
        height,
        x * this.ratio,
        y * this.ratio,
        width * this.ratio,
        height * this.ratio
      );
    });

    if (this.showGrid) {
      this.renderGrid();
    }

    this.engine.render();
  }

  renderGrid() {
    // Render rows
    for (let index = 0; index < this.rows + 1; index += 1) {
      this.engine.renderTexture(
        '/sprites/guidelines.png',
        2,
        0,
        1,
        1,
        0,
        index * Settings.tileSize * this.ratio,
        this.columns * Settings.tileSize * this.ratio,
        1
      );
    }

    // Render columns
    for (let index = 0; index < this.columns + 1; index += 1) {
      this.engine.renderTexture(
        '/sprites/guidelines.png',
        2,
        0,
        1,
        1,
        index * Settings.tileSize * this.ratio,
        0,
        1,
        this.rows * Settings.tileSize * this.ratio
      );
    }
  }

  updateSettings(
    rows: number,
    columns: number,
    ratio: number,
    pan: { x: number; y: number },
    showGrid: boolean,
    addSizeAfter: boolean
  ) {
    // Handle row added or removed
    if (rows !== this.rows) {
      if (rows > this.rows) {
        const newRow = [...new Array(this.columns)].map(() => null);
        this.terrains = addSizeAfter
          ? [...this.terrains, ...newRow]
          : [...newRow, ...this.terrains];

        if (!addSizeAfter) {
          this.entities = this.entities.map((entity) => ({
            ...entity,
            y: entity.y + Settings.tileSize,
          }));
        }
      } else {
        this.terrains.splice(
          addSizeAfter ? this.terrains.length - this.columns : 0,
          columns
        );

        if (!addSizeAfter) {
          this.entities = this.entities.map((entity) => ({
            ...entity,
            y: entity.y - Settings.tileSize,
          }));
        }
      }
    }

    // Handle column added or removed
    if (columns !== this.columns) {
      if (columns > this.columns) {
        for (let row = 1; row < rows + 1; row += 1) {
          const start = addSizeAfter
            ? this.columns * row + row - 1
            : this.columns * (row - 1) + row - 1;
          this.terrains.splice(start, 0, null);
        }

        if (!addSizeAfter) {
          this.entities = this.entities.map((entity) => ({
            ...entity,
            x: entity.x + Settings.tileSize,
          }));
        }
      } else {
        for (let row = 1; row < rows + 1; row += 1) {
          const start = addSizeAfter
            ? this.columns * row - row
            : this.columns * (row - 1) - (row - 1);
          this.terrains.splice(start, 1);
        }

        if (!addSizeAfter) {
          this.entities = this.entities.map((entity) => ({
            ...entity,
            x: entity.x - Settings.tileSize,
          }));
        }
      }
    }

    this.rows = rows;
    this.columns = columns;
    this.ratio = ratio;
    this.showGrid = showGrid;

    this.engine.translate(pan.x, pan.y);
  }
}
