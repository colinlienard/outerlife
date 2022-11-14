import { terrainsIndex } from '~~/game/data';
import { Engine } from '~~/game/engine';
import { Settings } from '~~/game/utils';

export class Editor {
  private readonly engine: Engine;

  private terrainMap: (number | null)[] = [];

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

  render() {
    this.engine.clear();

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
      } else {
        this.terrainMap.splice(
          addSizeAfter ? this.terrainMap.length - this.columns : 0,
          columns
        );
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
      } else {
        for (let row = 1; row < rows + 1; row += 1) {
          const start = addSizeAfter
            ? this.columns * row - row
            : this.columns * (row - 1) - (row - 1);
          this.terrainMap.splice(start, 1);
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
