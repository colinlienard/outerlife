import { SpriteComponent } from '~~/game/components';
import { environmentsIndex, terrainsIndex } from '~~/game/data';
import { Engine } from '~~/game/engine';
import { Settings } from '~~/game/utils';

type EnvironmentInMap = {
  x: number;
  y: number;
  constructorId: number;
};

export class Editor {
  private readonly engine: Engine;

  private terrainMap: (number | null)[] = [];

  private environmentMap: EnvironmentInMap[] = [];

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

    this.terrainMap = [...new Array(rows * columns)].map(() => null);

    this.engine
      .loadTextures([
        '/sprites/guidelines.png',
        '/sprites/terrain-001.png',
        '/sprites/environments-001.png',
      ])
      .then(() => {
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
    this.terrainMap = this.terrainMap.map((v, i) => (i === index ? value : v));
  }

  placeEnvironment(x: number, y: number, constructorId: number) {
    const { width, height } = new environmentsIndex[constructorId]().get(
      SpriteComponent
    );
    this.environmentMap.push({
      x: x - width / 2,
      y: y - height / 2,
      constructorId,
    });
    this.environmentMap.sort((a, b) =>
      a.y +
        new environmentsIndex[a.constructorId]().get(SpriteComponent).height >
      b.y + new environmentsIndex[b.constructorId]().get(SpriteComponent).height
        ? 1
        : -1
    );
  }

  selectEnvironment(x: number, y: number) {
    for (const environment of this.environmentMap) {
      const sprite = new environmentsIndex[environment.constructorId]().get(
        SpriteComponent
      );
      if (
        x > environment.x &&
        x < environment.x + sprite.width &&
        y > environment.y &&
        y < environment.y + sprite.height
      ) {
        return {
          x: environment.x,
          y: environment.y,
          index: this.environmentMap.indexOf(environment),
        };
      }
    }

    return null;
  }

  updateEnvironment(x: number, y: number, index: number) {
    for (let i = 0; i < this.environmentMap.length; i += 1) {
      if (i === index) {
        this.environmentMap[index] = { ...this.environmentMap[index], x, y };
        return;
      }
    }
  }

  deleteEnvironment(index: number) {
    this.environmentMap = this.environmentMap.filter((_, i) => i !== index);
  }

  render() {
    this.engine.clear();

    // Render terrains
    this.terrainMap.forEach((item, index) => {
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

    // Render environments
    this.environmentMap.forEach(({ x, y, constructorId }) => {
      const environment = new environmentsIndex[constructorId]();
      const { source, sourceX, sourceY, width, height } =
        environment.get(SpriteComponent);

      this.engine.renderTexture(
        source,
        sourceX,
        sourceY,
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
        0,
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
        0,
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
        this.terrainMap = addSizeAfter
          ? [...this.terrainMap, ...newRow]
          : [...newRow, ...this.terrainMap];

        if (!addSizeAfter) {
          this.environmentMap = this.environmentMap.map((environment) => ({
            ...environment,
            y: environment.y + Settings.tileSize,
          }));
        }
      } else {
        this.terrainMap.splice(
          addSizeAfter ? this.terrainMap.length - this.columns : 0,
          columns
        );

        if (!addSizeAfter) {
          this.environmentMap = this.environmentMap.map((environment) => ({
            ...environment,
            y: environment.y - Settings.tileSize,
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
          this.terrainMap.splice(start, 0, null);
        }

        if (!addSizeAfter) {
          this.environmentMap = this.environmentMap.map((environment) => ({
            ...environment,
            x: environment.x + Settings.tileSize,
          }));
        }
      } else {
        for (let row = 1; row < rows + 1; row += 1) {
          const start = addSizeAfter
            ? this.columns * row - row
            : this.columns * (row - 1) - (row - 1);
          this.terrainMap.splice(start, 1);
        }

        if (!addSizeAfter) {
          this.environmentMap = this.environmentMap.map((environment) => ({
            ...environment,
            x: environment.x - Settings.tileSize,
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
