import Entity from './Entities/Entity';
import Terrain from './Entities/Terrains/Terrain';
import { TILE_SIZE } from './globals';
import Scene from './Scene';
import { Collider, Interaction } from './types';

class Renderer {
  environmentContext: CanvasRenderingContext2D;

  yPixelsNumber = 200;

  ratio = 1;

  scene;

  terrainContext: CanvasRenderingContext2D;

  constructor(
    terrainContext: CanvasRenderingContext2D,
    environmentContext: CanvasRenderingContext2D,
    scene: Scene
  ) {
    this.environmentContext = environmentContext;
    this.terrainContext = terrainContext;
    this.scene = scene;
  }

  clear() {
    this.environmentContext.clearRect(
      0,
      0,
      this.scene.tilemap.columns * TILE_SIZE * this.ratio,
      this.scene.tilemap.rows * TILE_SIZE * this.ratio
    );
  }

  updateSize() {
    this.ratio = Math.round(window.innerHeight / this.yPixelsNumber);
    this.terrainContext.imageSmoothingEnabled = false;
    this.environmentContext.imageSmoothingEnabled = false;
  }

  render(options: { debug: boolean }) {
    this.renderTerrains(this.scene.terrains);

    if (options.debug) {
      this.renderGrid();
    }

    this.renderShadows(this.scene.entities);

    this.renderEntities(this.scene.entities);

    if (options.debug) {
      this.renderColliders(
        this.scene.colliders,
        this.scene.interactions,
        this.scene.organisms
      );
    }
  }

  renderColliders(
    colliders: Collider[],
    interactions: Interaction[],
    organisms: Entity[]
  ) {
    // Render environments colliders
    this.environmentContext.fillStyle = 'rgba(255, 0, 0, 0.5)';
    colliders.forEach((collider) => {
      this.environmentContext.fillRect(
        collider.x * this.ratio,
        collider.y * this.ratio,
        collider.width * this.ratio,
        collider.height * this.ratio
      );
    });

    // Render interactions
    this.environmentContext.fillStyle = 'rgba(0, 0, 255, 0.5)';
    interactions.forEach((interaction) => {
      this.environmentContext.fillRect(
        interaction.x * this.ratio,
        interaction.y * this.ratio,
        interaction.width * this.ratio,
        interaction.height * this.ratio
      );
    });

    // Render organisms colliders
    this.environmentContext.fillStyle = 'rgba(0, 255, 0, 0.5)';
    organisms.forEach((organism) => {
      const { collider } = organism;
      if (collider) {
        this.environmentContext.fillRect(
          Math.round((organism.position.x + collider.x) * this.ratio),
          Math.round((organism.position.y + collider.y) * this.ratio),
          collider.width * this.ratio,
          collider.height * this.ratio
        );
      }
    });

    this.environmentContext.fillStyle = 'transparent';
  }

  renderEntities(entities: Entity[]) {
    entities.forEach((entity) => {
      const { animator, position, sprite } = entity;

      // If the entity is animated
      if (animator) {
        this.environmentContext.drawImage(
          sprite.image,
          sprite.width *
            (animator.column + animator.currentAnimation.frameStart - 1), // position x in the source image
          sprite.height * animator.row, // position y in the source image
          sprite.width, // width of the sprite in the source image
          sprite.height, // height of the sprite in the source image
          Math.round(position.x * this.ratio), // position x in the canvas
          Math.round(position.y * this.ratio), // position y in the canvas
          sprite.width * this.ratio, // width of the sprite in the canvas
          sprite.height * this.ratio // height of the sprite in the canvas
        );
      }

      // If the entity is not animated
      else {
        this.environmentContext.drawImage(
          sprite.image,
          sprite.sourceX as number, // position x in the source image
          sprite.sourceY as number, // position y in the source image
          sprite.width, // width of the sprite in the source image
          sprite.height, // height of the sprite in the source image
          Math.round(position.x * this.ratio), // position x in the canvas
          Math.round(position.y * this.ratio), // position y in the canvas
          sprite.width * this.ratio, // width of the sprite in the canvas
          sprite.height * this.ratio // height of the sprite in the canvas
        );
      }
    });
  }

  renderGrid() {
    this.environmentContext.strokeStyle = 'white';

    for (let index = 0; index < this.scene.tilemap.columns; index += 1) {
      const x = index * TILE_SIZE * this.ratio;
      this.environmentContext.beginPath();
      this.environmentContext.moveTo(x, 0);
      this.environmentContext.lineTo(
        x,
        this.scene.tilemap.rows * TILE_SIZE * this.ratio
      );
      this.environmentContext.stroke();
    }

    for (let index = 0; index < this.scene.tilemap.rows; index += 1) {
      const y = index * TILE_SIZE * this.ratio;
      this.environmentContext.beginPath();
      this.environmentContext.moveTo(0, y);
      this.environmentContext.lineTo(
        this.scene.tilemap.columns * TILE_SIZE * this.ratio,
        y
      );
      this.environmentContext.stroke();
    }
  }

  renderShadows(entities: Entity[]) {
    entities.forEach((entity) => {
      const { position, sprite } = entity;
      if (sprite.shadow) {
        this.environmentContext.drawImage(
          sprite.image,
          sprite.shadow.sourceX, // position x in the source image
          sprite.shadow.sourceY, // position y in the source image
          sprite.shadow.width, // width of the sprite in the source image
          sprite.shadow.height, // height of the sprite in the source image
          Math.round((position.x + sprite.shadow.x) * this.ratio), // position x in the canvas
          Math.round((position.y + sprite.shadow.y) * this.ratio), // position y in the canvas
          sprite.shadow.width * this.ratio, // width of the sprite in the canvas
          sprite.shadow.height * this.ratio // height of the sprite in the canvas
        );
      }
    });
  }

  renderTerrains(terrains: Terrain[]) {
    terrains.forEach((terrain) => {
      const { position, sprite } = terrain;
      this.terrainContext.drawImage(
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
    this.terrainContext.setTransform(
      1,
      0,
      0,
      1,
      Math.round(x * this.ratio),
      Math.round(y * this.ratio)
    );

    this.environmentContext.setTransform(
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
