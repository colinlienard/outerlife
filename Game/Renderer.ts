import WorldMatrix from '~~/Engine/WorldMatrix';
// import Entity from './Entities/Entity';
// import Terrain from './Entities/Terrains/Terrain';
import { TILE_SIZE, Y_PIXELS_NUMBER } from './globals';
import Scene from './Scene';
// import { Collider, Interaction } from './types';

class Renderer {
  context: WebGL2RenderingContext;

  offsetX = 0;

  offsetY = 0;

  ratio = 1;

  scene;

  sceneWidth = 0;

  sceneHeight = 0;

  viewPortWidth = 0;

  viewPortHeight = 0;

  test = null;

  constructor(context: WebGL2RenderingContext, scene: Scene) {
    this.context = context;
    this.scene = scene;

    this.context.clearColor(0, 0, 0, 1);
    this.context.enable(this.context.BLEND);
    this.context.blendFunc(
      this.context.SRC_ALPHA,
      this.context.ONE_MINUS_SRC_ALPHA
    );

    WorldMatrix.create();
  }

  clear() {
    this.context.clear(this.context.COLOR_BUFFER_BIT);
  }

  isVisible(x: number, y: number, width: number, height: number) {
    return (
      x + width > this.offsetX &&
      x < this.offsetX + this.viewPortWidth &&
      y + height > this.offsetY &&
      y < this.offsetY + this.viewPortHeight
    );
  }

  updateSize() {
    WorldMatrix.create();

    this.ratio = Math.round(window.innerHeight / Y_PIXELS_NUMBER);

    // this.terrainContext.imageSmoothingEnabled = false;
    // this.environmentContext.imageSmoothingEnabled = false;

    this.sceneWidth = this.scene.tilemap.columns * TILE_SIZE * this.ratio;
    this.sceneHeight = this.scene.tilemap.rows * TILE_SIZE * this.ratio;

    this.viewPortWidth = window.innerWidth / this.ratio;
    this.viewPortHeight = window.innerHeight / this.ratio;
  }

  render(options: { debug: boolean }) {
    // this.renderTerrains(this.scene.terrains);

    if (options.debug) {
      //   this.renderGrid();
    }

    // this.renderShadows(this.scene.entities);

    this.renderEntities();

    // if (options.debug) {
    //   this.renderColliders(
    //     this.scene.colliders,
    //     this.scene.interactions,
    //     this.scene.organisms
    //   );
    // }
  }

  // renderColliders(
  //   colliders: Collider[],
  //   interactions: Interaction[],
  //   organisms: Entity[]
  // ) {
  //   // Render environments colliders
  //   this.environmentContext.fillStyle = 'rgba(255, 0, 0, 0.5)';
  //   colliders.forEach((collider) => {
  //     this.environmentContext.fillRect(
  //       collider.x * this.ratio,
  //       collider.y * this.ratio,
  //       collider.width * this.ratio,
  //       collider.height * this.ratio
  //     );
  //   });

  //   // Render interactions
  //   this.environmentContext.fillStyle = 'rgba(0, 0, 255, 0.5)';
  //   interactions.forEach((interaction) => {
  //     this.environmentContext.fillRect(
  //       interaction.x * this.ratio,
  //       interaction.y * this.ratio,
  //       interaction.width * this.ratio,
  //       interaction.height * this.ratio
  //     );
  //   });

  //   // Render organisms colliders
  //   this.environmentContext.fillStyle = 'rgba(0, 255, 0, 0.5)';
  //   organisms.forEach((organism) => {
  //     const { collider } = organism;
  //     if (collider) {
  //       this.environmentContext.fillRect(
  //         Math.floor((organism.position.x + collider.x) * this.ratio),
  //         Math.floor((organism.position.y + collider.y) * this.ratio),
  //         collider.width * this.ratio,
  //         collider.height * this.ratio
  //       );
  //     }
  //   });

  //   this.environmentContext.fillStyle = 'transparent';
  // }

  renderEntities() {
    this.scene.entities.forEach((entity) => {
      const { animator, position, sprite } = entity;

      // if (this.isVisible(position.x, position.y, sprite.width, sprite.height)) {
      // If the entity is animated
      if (animator) {
        entity.texture?.render(
          position.x,
          position.y,
          sprite.width *
            (animator.column + animator.currentAnimation.frameStart - 1),
          sprite.height * animator.row
        );
      }

      // If the entity is not animated
      else {
        entity.texture?.render(
          position.x,
          position.y,
          sprite.sourceX as number,
          sprite.sourceY as number
        );
      }
      // }
    });
  }

  // renderGrid() {
  //   this.environmentContext.strokeStyle = 'white';

  //   for (let index = 0; index < this.scene.tilemap.columns; index += 1) {
  //     const x = index * TILE_SIZE * this.ratio;
  //     this.environmentContext.beginPath();
  //     this.environmentContext.moveTo(x, 0);
  //     this.environmentContext.lineTo(
  //       x,
  //       this.scene.tilemap.rows * TILE_SIZE * this.ratio
  //     );
  //     this.environmentContext.stroke();
  //   }

  //   for (let index = 0; index < this.scene.tilemap.rows; index += 1) {
  //     const y = index * TILE_SIZE * this.ratio;
  //     this.environmentContext.beginPath();
  //     this.environmentContext.moveTo(0, y);
  //     this.environmentContext.lineTo(
  //       this.scene.tilemap.columns * TILE_SIZE * this.ratio,
  //       y
  //     );
  //     this.environmentContext.stroke();
  //   }
  // }

  // renderShadows(entities: Entity[]) {
  //   entities.forEach((entity) => {
  //     const { position, sprite } = entity;
  //     if (
  //       sprite.shadow &&
  //       this.isVisible(
  //         position.x + sprite.shadow.x,
  //         position.y + sprite.shadow.y,
  //         sprite.shadow.width,
  //         sprite.shadow.height
  //       )
  //     ) {
  //       this.environmentContext.drawImage(
  //         sprite.image,
  //         sprite.shadow.sourceX, // position x in the source image
  //         sprite.shadow.sourceY, // position y in the source image
  //         sprite.shadow.width, // width of the sprite in the source image
  //         sprite.shadow.height, // height of the sprite in the source image
  //         Math.floor((position.x + sprite.shadow.x) * this.ratio), // position x in the canvas
  //         Math.floor((position.y + sprite.shadow.y) * this.ratio), // position y in the canvas
  //         sprite.shadow.width * this.ratio, // width of the sprite in the canvas
  //         sprite.shadow.height * this.ratio // height of the sprite in the canvas
  //       );
  //     }
  //   });
  // }

  // renderTerrains(terrains: Terrain[]) {
  //   terrains.forEach((terrain) => {
  //     const { position, sprite } = terrain;
  //     if (this.isVisible(position.x, position.y, TILE_SIZE, TILE_SIZE)) {
  //       this.terrainContext.drawImage(
  //         sprite.image,
  //         sprite.x, // position x in the source image
  //         sprite.y, // position y in the source image
  //         TILE_SIZE, // width of the sprite in the source image
  //         TILE_SIZE, // height of the sprite in the source image
  //         position.x * this.ratio, // position x in the canvas
  //         position.y * this.ratio, // position y in the canvas
  //         TILE_SIZE * this.ratio, // width of the sprite in the canvas
  //         TILE_SIZE * this.ratio // height of the sprite in the canvas
  //       );
  //     }
  //   });
  // }

  // translate(offsetX: number, offsetY: number) {
  //   this.offsetX = Math.abs(Math.round(offsetX));
  //   this.offsetY = Math.abs(Math.round(offsetY));

  //   this.terrainContext.setTransform(
  //     1,
  //     0,
  //     0,
  //     1,
  //     Math.floor(offsetX * this.ratio),
  //     Math.floor(offsetY * this.ratio)
  //   );

  //   this.environmentContext.setTransform(
  //     1,
  //     0,
  //     0,
  //     1,
  //     Math.floor(offsetX * this.ratio),
  //     Math.floor(offsetY * this.ratio)
  //   );
  // }
}

export default Renderer;
