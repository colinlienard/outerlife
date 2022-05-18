import Entity from './Entities/Entity';
import Terrain from './Entities/Terrains/Terrain';
import { TILE_SIZE } from './globals';
import Scene from './Scene';
import { Collider, Interaction } from './types';

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

  render(options: { colliders: boolean }) {
    this.#renderTerrains(this.#scene.terrains);
    this.#renderShadows(this.#scene.entities);
    this.#renderEntities(this.#scene.entities);

    if (options.colliders) {
      this.#renderColliders(
        this.#scene.colliders,
        this.#scene.interactions,
        this.#scene.organisms
      );
    }
  }

  #renderColliders(
    colliders: Collider[],
    interactions: Interaction[],
    organisms: Entity[]
  ) {
    // Render environments colliders
    this.#context.fillStyle = 'rgba(255, 0, 0, 0.5)';
    colliders.forEach((collider) => {
      this.#context.fillRect(
        collider.x * this.ratio,
        collider.y * this.ratio,
        collider.width * this.ratio,
        collider.height * this.ratio
      );
    });

    // Render interactions
    this.#context.fillStyle = 'rgba(0, 0, 255, 0.5)';
    interactions.forEach((interaction) => {
      this.#context.fillRect(
        interaction.x * this.ratio,
        interaction.y * this.ratio,
        interaction.width * this.ratio,
        interaction.height * this.ratio
      );
    });

    // Render organisms colliders
    this.#context.fillStyle = 'rgba(0, 255, 0, 0.5)';
    organisms.forEach((organism) => {
      const { collider } = organism;
      if (collider) {
        this.#context.fillRect(
          (organism.position.x + collider.x) * this.ratio,
          (organism.position.y + collider.y) * this.ratio,
          collider.width * this.ratio,
          collider.height * this.ratio
        );
      }
    });

    this.#context.fillStyle = 'transparent';
  }

  #renderEntities(entities: Entity[]) {
    entities.forEach((entity) => {
      const { animator, position, sprite } = entity;

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
    });
  }

  #renderShadows(entities: Entity[]) {
    entities.forEach((entity) => {
      const { position, sprite } = entity;
      if (sprite.shadow) {
        this.#context.drawImage(
          sprite.image,
          sprite.shadow.sourceX, // position x in the source image
          sprite.shadow.sourceY, // position y in the source image
          sprite.shadow.width, // width of the sprite in the source image
          sprite.shadow.height, // height of the sprite in the source image
          (position.x + sprite.shadow.x) * this.ratio, // position x in the canvas
          (position.y + sprite.shadow.y) * this.ratio, // position y in the canvas
          sprite.shadow.width * this.ratio, // width of the sprite in the canvas
          sprite.shadow.height * this.ratio // height of the sprite in the canvas
        );
      }
    });
  }

  #renderTerrains(terrains: Terrain[]) {
    terrains.forEach((terrain) => {
      const { position, sprite } = terrain;
      this.#context.drawImage(
        sprite.image,
        sprite.x, // position x in the source image
        sprite.y, // position y in the source image
        TILE_SIZE, // width of the sprite in the source image
        TILE_SIZE, // height of the sprite in the source image
        position.x * this.ratio, // position x in the canvas
        position.y * this.ratio, // position y in the canvas
        TILE_SIZE * this.ratio, // width of the sprite in the canvas
        TILE_SIZE * this.ratio // height of the sprite in the canvas
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
