import { SpriteComponent } from '~~/game/components';
import { environmentsIndex, terrainsIndex } from '~~/game/data';
import { Engine } from '~~/game/engine';
import { Map, MapEnvironment, MapTerrain, Settings } from '~~/game/utils';

export class Editor {
  private readonly engine: Engine;

  private terrains: MapTerrain[] = [];

  private environments: MapEnvironment[] = [];

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
    this.terrains = this.terrains.map((v, i) => (i === index ? value : v));
  }

  placeEnvironment(x: number, y: number, constructorId: number) {
    const { width, height } = new environmentsIndex[constructorId]().get(
      SpriteComponent
    );
    this.environments.push({
      x: x - width / 2,
      y: y - height / 2,
      constructorId,
    });
    this.environments.sort((a, b) =>
      a.y +
        new environmentsIndex[a.constructorId]().get(SpriteComponent).height >
      b.y + new environmentsIndex[b.constructorId]().get(SpriteComponent).height
        ? 1
        : -1
    );
  }

  selectEnvironment(x: number, y: number) {
    for (const environment of this.environments) {
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
          index: this.environments.indexOf(environment),
        };
      }
    }

    return null;
  }

  updateEnvironment(x: number, y: number, index: number) {
    for (let i = 0; i < this.environments.length; i += 1) {
      if (i === index) {
        this.environments[index] = { ...this.environments[index], x, y };
        return;
      }
    }
  }

  deleteEnvironment(index: number) {
    this.environments = this.environments.filter((_, i) => i !== index);
  }

  getMap(): Map {
    return {
      rows: this.rows,
      columns: this.columns,
      terrains: this.terrains,
      environments: this.environments,
    };
  }

  setTerrainsAndEnvironments(
    terrains: MapTerrain[],
    environments: MapEnvironment[]
  ) {
    this.terrains = terrains;
    this.environments = environments;
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

    // Render environments
    this.environments.forEach(({ x, y, constructorId }) => {
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
        this.terrains = addSizeAfter
          ? [...this.terrains, ...newRow]
          : [...newRow, ...this.terrains];

        if (!addSizeAfter) {
          this.environments = this.environments.map((environment) => ({
            ...environment,
            y: environment.y + Settings.tileSize,
          }));
        }
      } else {
        this.terrains.splice(
          addSizeAfter ? this.terrains.length - this.columns : 0,
          columns
        );

        if (!addSizeAfter) {
          this.environments = this.environments.map((environment) => ({
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
          this.terrains.splice(start, 0, null);
        }

        if (!addSizeAfter) {
          this.environments = this.environments.map((environment) => ({
            ...environment,
            x: environment.x + Settings.tileSize,
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
          this.environments = this.environments.map((environment) => ({
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
