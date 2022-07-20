import { environmentTiles, terrainTiles } from '~~/game/data';
import { Settings, Tilemap } from '~~/game/utils';

class Editor {
  context: CanvasRenderingContext2D;

  images: { [key: string]: HTMLImageElement } = {};

  ratio = 0;

  tilemap: Tilemap = {
    rows: 0,
    columns: 0,
    terrains: [],
    environments: [],
    interactions: [],
  };

  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  bindImages() {
    const images: { [key: string]: HTMLImageElement } = {};

    Object.values(terrainTiles).reduce((previous: string[], { source }) => {
      if (previous.includes(source)) {
        return previous;
      }
      const image = new Image();
      image.src = `/sprites/${source}.png`;
      images[`${source}`] = image;
      return [...previous, source];
    }, []);

    this.images = images;
  }

  changeMap(map: Tilemap) {
    this.tilemap.terrains = map.terrains;
    this.tilemap.environments = map.environments;

    this.clear();
    this.drawMap();
  }

  clear() {
    this.context.clearRect(
      0,
      0,
      this.tilemap.columns * Settings.tileSize * this.ratio,
      this.tilemap.rows * Settings.tileSize * this.ratio
    );
  }

  drawEnvironment() {
    for (let row = 0; row < this.tilemap.rows; row += 1) {
      for (let column = 0; column < this.tilemap.columns; column += 1) {
        const Tile =
          environmentTiles[
            this.tilemap.environments[row * this.tilemap.columns + column]
          ];
        if (Tile) {
          const instance = new Tile(0, 0);
          const { sprite } = instance;
          const x = column * Settings.tileSize - sprite.width / 2 + 8;
          const y = row * Settings.tileSize - sprite.height + 8;
          sprite.image.onload = () => {
            if (sprite.shadow) {
              const { shadow } = sprite;
              this.context.drawImage(
                sprite.image,
                shadow.sourceX, // position x in the source image
                shadow.sourceY, // position y in the source image
                shadow.width, // width of the sprite in the source image
                shadow.height, // height of the sprite in the source image
                (x + shadow.x) * this.ratio, // position x in the canvas
                (y + shadow.y) * this.ratio, // position y in the canvas
                shadow.width * this.ratio, // width of the sprite in the canvas
                shadow.height * this.ratio // height of the sprite in the canvas
              );
            }
            this.context.drawImage(
              sprite.image,
              sprite.sourceX as number, // position x in the source image
              sprite.sourceY as number, // position y in the source image
              sprite.width, // width of the sprite in the source image
              sprite.height, // height of the sprite in the source image
              x * this.ratio, // position x in the canvas
              y * this.ratio, // position y in the canvas
              sprite.width * this.ratio, // width of the sprite in the canvas
              sprite.height * this.ratio // height of the sprite in the canvas
            );
          };
        }
      }
    }
  }

  drawMap() {
    this.clear();
    this.drawTerrain();
    this.drawEnvironment();
  }

  drawTerrain() {
    for (let row = 0; row < this.tilemap.rows; row += 1) {
      for (let column = 0; column < this.tilemap.columns; column += 1) {
        const tile =
          terrainTiles[
            this.tilemap.terrains[row * this.tilemap.columns + column]
          ];
        if (tile) {
          this.context.drawImage(
            this.images[tile.source],
            tile.x, // position x in the source image
            tile.y, // position y in the source image
            Settings.tileSize, // width of the sprite in the source image
            Settings.tileSize, // height of the sprite in the source image
            column * Settings.tileSize * this.ratio, // position x in the canvas
            row * Settings.tileSize * this.ratio, // position y in the canvas
            Settings.tileSize * this.ratio, // width of the sprite in the canvas
            Settings.tileSize * this.ratio // height of the sprite in the canvas
          );
        }
      }
    }
  }

  fillWithVoid() {
    for (let i = 0; i < this.tilemap.rows * this.tilemap.columns; i += 1) {
      this.tilemap.terrains.push('000');
      this.tilemap.environments.push('000');
    }
  }

  getTile(
    row: number,
    column: number,
    type: 'terrains' | 'environments'
  ): string {
    return this.tilemap[type][row * this.tilemap.columns + column];
  }

  placeTile(
    row: number,
    column: number,
    type: 'terrains' | 'environments',
    tile: string
  ) {
    this.tilemap[type][row * this.tilemap.columns + column] = tile;

    this.clear();
    this.drawMap();
  }

  updateSize(rows: number, columns: number, ratio: number) {
    // If no changes are made, do nothing
    if (
      this.tilemap.rows === rows &&
      this.tilemap.columns === columns &&
      this.ratio === ratio
    ) {
      return;
    }
    for (let row = 1; row < this.tilemap.rows + 1; row += 1) {
      // Add a column
      if (this.tilemap.columns < columns) {
        this.tilemap.terrains.splice(row * columns - 1, 0, '000');
        this.tilemap.environments.splice(row * columns - 1, 0, '000');
      }

      // Remove a column
      else if (this.tilemap.columns > columns) {
        this.tilemap.terrains.splice(row * columns, 1);
        this.tilemap.environments.splice(row * columns, 1);
      }
    }
    this.tilemap.rows = rows;
    this.tilemap.columns = columns;
    this.ratio = ratio;
    this.context.imageSmoothingEnabled = false;
  }
}

export default Editor;
