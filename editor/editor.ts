import { AnimationComponent, SpriteComponent } from '~~/game/components';
import { environmentsIndex, organismsIndex, terrainsIndex } from '~~/game/data';
import { Engine } from '~~/game/engine';
import {
  GameMap,
  GameMapEntity,
  GameMapInteraction,
  GameMapItemType,
  GameMapTerrain,
  Settings,
} from '~~/game/utils';

type EditorEntity = { data: GameMapEntity; type: GameMapItemType };

export class Editor {
  private readonly engine!: Engine;

  private terrains: GameMapTerrain[] = [];

  private entities: EditorEntity[] = [];

  private interactions: GameMapInteraction[] = [];

  private ratio: number;

  private showGrid: boolean = true;

  private rows: number;

  private columns: number;

  constructor(
    canvas: HTMLCanvasElement,
    rows: number,
    columns: number,
    ratio: number,
    render = true
  ) {
    this.ratio = ratio;
    this.rows = rows;
    this.columns = columns;

    this.terrains = [...new Array(rows * columns)].map(() => null);

    if (!render) {
      return;
    }

    // Setup rendering context
    this.engine = new Engine(canvas);
    this.engine.resize();

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

  placeEntity(
    x: number,
    y: number,
    constructorId: number,
    type: GameMapItemType
  ) {
    const index = type === 'environment' ? environmentsIndex : organismsIndex;
    const { width, height } = new index[constructorId]().get(SpriteComponent);
    this.entities.push({
      data: [x - width / 2, y - height / 2, constructorId],
      type,
    });
    this.entities.sort((a, b) => {
      const indexA =
        a.type === 'environment' ? environmentsIndex : organismsIndex;
      const indexB =
        b.type === 'environment' ? environmentsIndex : organismsIndex;
      return a.data[1] + new indexA[a.data[2]]().get(SpriteComponent).height >
        b.data[1] + new indexB[b.data[2]]().get(SpriteComponent).height
        ? 1
        : -1;
    });
  }

  selectEntity(x: number, y: number, type: GameMapItemType) {
    for (const entity of this.entities) {
      if (entity.type === type) {
        const index =
          type === 'environment' ? environmentsIndex : organismsIndex;
        const sprite = new index[entity.data[2]]().get(SpriteComponent);
        if (
          x > entity.data[0] &&
          x < entity.data[0] + sprite.width &&
          y > entity.data[1] &&
          y < entity.data[1] + sprite.height
        ) {
          return {
            x: entity.data[0],
            y: entity.data[1],
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
        this.entities[index].data = [x, y, this.entities[index].data[2]];
        return;
      }
    }
  }

  deleteEntity(index: number) {
    this.entities = this.entities.filter((_, i) => i !== index);
  }

  placeInteraction(x: number, y: number) {
    const width = 16;
    const height = 16;
    this.interactions.push({
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
      data: {
        type: 'switch-map',
        map: '',
        playerX: 0,
        playerY: 0,
      },
    });
  }

  selectInteraction(x: number, y: number) {
    for (const interaction of this.interactions) {
      if (
        x > interaction.x &&
        x < interaction.x + interaction.width &&
        y > interaction.y &&
        y < interaction.y + interaction.height
      ) {
        return {
          ...interaction,
          index: this.interactions.indexOf(interaction),
        };
      }
    }

    return null;
  }

  updateInteraction(data: GameMapInteraction, index: number) {
    for (let i = 0; i < this.interactions.length; i += 1) {
      if (i === index) {
        this.interactions[index] = { ...this.interactions[index], ...data };
        return;
      }
    }
  }

  deleteInteraction(index: number) {
    this.interactions = this.interactions.filter((_, i) => i !== index);
  }

  getInteractions() {
    return this.interactions;
  }

  getMap(): GameMap {
    const environments = this.entities
      .filter((entity) => entity.type === 'environment')
      .map((entity) => entity.data);
    const organisms = this.entities
      .filter((entity) => entity.type === 'organism')
      .map((entity) => entity.data);

    return {
      rows: this.rows,
      columns: this.columns,
      terrains: this.terrains,
      environments,
      organisms,
      interactions: this.interactions,
    };
  }

  setMapData(map: GameMap) {
    this.terrains = map.terrains;

    const environments = map.environments.map((environment) => ({
      data: environment,
      type: 'environment',
    })) as EditorEntity[];
    const organisms = map.organisms.map((organism) => ({
      data: organism,
      type: 'organism',
    })) as EditorEntity[];
    this.entities = [...environments, ...organisms];

    this.interactions = map.interactions;
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

      this.engine.queueTextureRender(
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
    this.entities.forEach(({ data, type }) => {
      const [x, y, constructorId] = data;
      const index = type === 'environment' ? environmentsIndex : organismsIndex;
      const entity = new index[constructorId]();
      const { source, sourceX, sourceY, width, height } =
        entity.get(SpriteComponent);
      const animation = entity.get(AnimationComponent);

      this.engine.queueTextureRender(
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

    // Render interactions
    this.interactions.forEach(({ x, y, width, height }) => {
      this.engine.queueTextureRender(
        '/sprites/guidelines.png',
        2,
        0,
        1,
        1,
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
    this.engine.flush();
  }

  renderGrid() {
    // Render rows
    for (let index = 0; index < this.rows + 1; index += 1) {
      this.engine.queueTextureRender(
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
      this.engine.queueTextureRender(
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
    mapGrowsAfter: boolean
  ) {
    // Handle row added or removed
    if (rows !== this.rows) {
      if (rows > this.rows) {
        const difference = rows - this.rows;
        const newRow = [...new Array(this.columns * difference)].map(
          () => null
        );
        this.terrains = mapGrowsAfter
          ? [...this.terrains, ...newRow]
          : [...newRow, ...this.terrains];

        if (!mapGrowsAfter) {
          this.entities = this.entities.map((entity) => ({
            ...entity,
            data: [
              entity.data[0],
              entity.data[1] + Settings.tileSize * difference,
              entity.data[2],
            ],
          }));
        }
      } else {
        const difference = this.rows - rows;
        this.terrains.splice(
          mapGrowsAfter ? this.terrains.length - this.columns * difference : 0,
          columns * difference
        );

        if (!mapGrowsAfter) {
          this.entities = this.entities.map((entity) => ({
            ...entity,
            data: [
              entity.data[0],
              entity.data[1] - Settings.tileSize * difference,
              entity.data[2],
            ],
          }));
        }
      }
    }

    // Handle column added or removed
    if (columns !== this.columns) {
      if (columns > this.columns) {
        const difference = columns - this.columns;
        for (let row = 1; row < rows + 1; row += 1) {
          const start = mapGrowsAfter
            ? this.columns * row + difference * (row - 1)
            : this.columns * (row - 1) + difference * (row - 1);
          this.terrains.splice(
            start,
            0,
            ...[...new Array(difference)].map(() => null)
          );
        }

        if (!mapGrowsAfter) {
          this.entities = this.entities.map((entity) => ({
            ...entity,
            data: [
              entity.data[0] + Settings.tileSize * difference,
              entity.data[1],
              entity.data[2],
            ],
          }));
        }
      } else {
        const difference = this.columns - columns;
        for (let row = 1; row < rows + 1; row += 1) {
          const start = mapGrowsAfter ? columns * row : columns * (row - 1);
          this.terrains.splice(start, difference);
        }

        if (!mapGrowsAfter) {
          this.entities = this.entities.map((entity) => ({
            ...entity,
            data: [
              entity.data[0] - Settings.tileSize * difference,
              entity.data[1],
              entity.data[2],
            ],
          }));
        }
      }
    }

    this.rows = rows;
    this.columns = columns;
    this.ratio = ratio;
    this.showGrid = showGrid;

    this.engine?.translate(pan.x, pan.y);
  }
}
