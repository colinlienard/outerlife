import { terrainTiles } from '~~/game/data';
import { Engine } from '~~/game/engine';
import { Settings } from '~~/game/utils';

export class Editor {
  private readonly engine: Engine;

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

    this.engine
      .loadTextures([
        '/sprites/guidelines.png',
        '/sprites/terrain-001.png',
        '/sprites/environments-001.png',
      ])
      .then(() => {
        this.render([]);
      });
  }

  render(terrains: string[]) {
    this.engine.clear();

    if (this.showGrid) {
      this.renderGrid();
    }

    terrains.forEach((item, index) => {
      const terrain = terrainTiles[item];
      const row = Math.floor(this.rows / index);
      const column = Math.floor(this.columns / index);

      this.engine.renderTexture(
        terrain.source,
        terrain.x,
        terrain.y,
        Settings.tileSize,
        Settings.tileSize,
        row * this.ratio,
        column * this.ratio,
        Settings.tileSize * this.ratio,
        Settings.tileSize * this.ratio
      );
    });

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
    showGrid: boolean
  ) {
    this.rows = rows;
    this.columns = columns;
    this.ratio = ratio;
    this.showGrid = showGrid;

    this.engine.translate(pan.x, pan.y);
  }
}
