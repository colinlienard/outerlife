import Entity from './Entities/Entity';
import Terrain from './Entities/Terrains/Terrain';
import Scene from './Scene';

class Renderer {
  #context: CanvasRenderingContext2D;

  #yPixelsNumber = 200;

  #ratio = 1;

  constructor(context: CanvasRenderingContext2D) {
    this.#context = context;
  }

  clear() {
    this.#context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  updateSize() {
    this.#ratio = Math.round(window.innerHeight / this.#yPixelsNumber);
    this.#context.imageSmoothingEnabled = false;
  }

  render(scene: Scene) {
    this.#renderTerrains(scene.tilemap.terrains, 16);
    this.#renderEntities(scene.entities);
  }

  #renderEntities(entities: Entity[]) {
    entities.forEach((entity) => {
      const { sprite, position } = entity;
      if (sprite.behind) {
        this.#context.drawImage(
          sprite.image,
          sprite.behind.sourceX, // position x in the source image
          sprite.behind.sourceY, // position y in the source image
          sprite.behind.width, // width of the sprite in the source image
          sprite.behind.height, // height of the sprite in the source image
          (position.x + sprite.behind.x) * this.#ratio, // position x in the canvas
          (position.y + sprite.behind.y) * this.#ratio, // position y in the canvas
          sprite.behind.width * this.#ratio, // width of the sprite in the canvas
          sprite.behind.height * this.#ratio // height of the sprite in the canvas
        );
      }
      this.#context.drawImage(
        sprite.image,
        sprite.width * (sprite.column + sprite.currentAnimation.frameStart - 1), // position x in the source image
        sprite.height * sprite.row, // position y in the source image
        sprite.width, // width of the sprite in the source image
        sprite.height, // height of the sprite in the source image
        position.x * this.#ratio, // position x in the canvas
        position.y * this.#ratio, // position y in the canvas
        sprite.width * this.#ratio, // width of the sprite in the canvas
        sprite.height * this.#ratio // height of the sprite in the canvas
      );
    });
  }

  #renderTerrains(terrains: Terrain[], tileSize: number) {
    terrains.forEach((terrain) => {
      const { sprite, position } = terrain;
      this.#context.drawImage(
        sprite.image,
        sprite.x, // position x in the source image
        sprite.y, // position y in the source image
        tileSize, // width of the sprite in the source image
        tileSize, // height of the sprite in the source image
        position.x * this.#ratio, // position x in the canvas
        position.y * this.#ratio, // position y in the canvas
        tileSize * this.#ratio, // width of the sprite in the canvas
        tileSize * this.#ratio // height of the sprite in the canvas
      );
    });
  }
}

export default Renderer;
