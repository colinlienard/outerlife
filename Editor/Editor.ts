import TerrainTiles from '~~/Game/Entities/Terrains/TerrainTiles';
import { Tilemap } from '~~/Game/types';

class Editor {
  context: CanvasRenderingContext2D;

  images: { [key: string]: HTMLImageElement } = {};

  ratio: number = 0;

  tilemap: Tilemap = {
    rows: 0,
    columns: 0,
    map: ['001'],
  };

  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  bindImages() {
    const images: { [key: string]: HTMLImageElement } = {};

    Object.values(TerrainTiles).reduce((previous: string[], { source }) => {
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

  drawMap(tileSize: number) {
    for (let row = 0; row < this.tilemap.rows; row += 1) {
      for (let column = 0; column < this.tilemap.columns; column += 1) {
        const tile =
          TerrainTiles[this.tilemap.map[row * this.tilemap.columns + column]];
        if (tile) {
          this.context.drawImage(
            this.images[tile.source],
            tile.x, // position x in the source image
            tile.y, // position y in the source image
            tileSize, // width of the sprite in the source image
            tileSize, // height of the sprite in the source image
            column * tileSize * this.ratio, // position x in the canvas
            row * tileSize * this.ratio, // position y in the canvas
            tileSize * this.ratio, // width of the sprite in the canvas
            tileSize * this.ratio // height of the sprite in the canvas
          );
        }
      }
    }
  }

  updateSize(rows: number, columns: number, ratio: number) {
    this.tilemap.rows = rows;
    this.tilemap.columns = columns;
    this.ratio = ratio;
  }
}

export default Editor;
