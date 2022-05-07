import Entity from './Entities/Entity';
import Terrain from './Entities/Terrains/Terrain';
import Scene from './Scene';

class Renderer {
  #context: CanvasRenderingContext2D;

  #yPixelsNumber = 200;

  ratio = 1;

  #scene;

  constructor(context: CanvasRenderingContext2D, scene: Scene) {
    this.#context = context;
    this.#scene = scene;
  }

  clear() {
    this.#context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  updateSize() {
    this.ratio = Math.round(window.innerHeight / this.#yPixelsNumber);
    this.#context.imageSmoothingEnabled = false;
  }

  render() {
    this.#renderTerrains(this.#scene.tilemap.terrains, 16);
    // this.#renderEntities(this.#scene.entities);
    this.#scene.entities.forEach((entity) => {
      this.#renderEntity(entity);
    });
  }

  #renderEntity(entity: Entity) {
    const { animator, position, sprite } = entity;

    // If the entity has a layer behind it
    if (sprite.behind) {
      this.#context.drawImage(
        sprite.image,
        sprite.behind.sourceX, // position x in the source image
        sprite.behind.sourceY, // position y in the source image
        sprite.behind.width, // width of the sprite in the source image
        sprite.behind.height, // height of the sprite in the source image
        (position.x + sprite.behind.x) * this.ratio, // position x in the canvas
        (position.y + sprite.behind.y) * this.ratio, // position y in the canvas
        sprite.behind.width * this.ratio, // width of the sprite in the canvas
        sprite.behind.height * this.ratio // height of the sprite in the canvas
      );
    }

    // If the entity is animated
    if (animator) {
      this.#context.drawImage(
        sprite.image,
        sprite.width *
          (animator.column + animator.currentAnimation.frameStart - 1), // position x in the source image
        sprite.height * animator.row, // position y in the source image
        sprite.width, // width of the sprite in the source image
        sprite.height, // height of the sprite in the source image
        position.x * this.ratio, // position x in the canvas
        position.y * this.ratio, // position y in the canvas
        sprite.width * this.ratio, // width of the sprite in the canvas
        sprite.height * this.ratio // height of the sprite in the canvas
      );
    }

    // If the entity is not animated
    else {
      this.#context.drawImage(
        sprite.image,
        sprite.sourceX as number, // position x in the source image
        sprite.sourceY as number, // position y in the source image
        sprite.width, // width of the sprite in the source image
        sprite.height, // height of the sprite in the source image
        position.x * this.ratio, // position x in the canvas
        position.y * this.ratio, // position y in the canvas
        sprite.width * this.ratio, // width of the sprite in the canvas
        sprite.height * this.ratio // height of the sprite in the canvas
      );
    }
  }

  #renderTerrains(terrains: Terrain[], tileSize: number) {
    terrains.forEach((terrain) => {
      const { position, sprite } = terrain;
      this.#context.drawImage(
        sprite.image,
        sprite.x, // position x in the source image
        sprite.y, // position y in the source image
        tileSize, // width of the sprite in the source image
        tileSize, // height of the sprite in the source image
        position.x * this.ratio, // position x in the canvas
        position.y * this.ratio, // position y in the canvas
        tileSize * this.ratio, // width of the sprite in the canvas
        tileSize * this.ratio // height of the sprite in the canvas
      );
    });
  }

  translate(x: number, y: number) {
    this.#context.setTransform(
      1,
      0,
      0,
      1,
      Math.round(x * this.ratio),
      Math.round(y * this.ratio)
    );
  }
}

export default Renderer;
