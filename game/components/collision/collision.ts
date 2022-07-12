import { Box } from '~~/game/utils/2d';
import { Component } from '~~/game/utils/ecs';

export class Collision implements Component {
  readonly box: Box;

  constructor(box: Box) {
    this.box = box;
  }

  // eslint-disable-next-line class-methods-use-this
  update() {
    // this.collisions.forEach((collision) => {
    //   // Perform collisions only on collisions close to the organism
    //   if (
    //     getDistance(
    //       organism.position.x,
    //       organism.position.y,
    //       collision.x,
    //       collision.y
    //     ) < 48
    //   ) {
    //     // Distances between centers
    //     const distanceX =
    //       organism.position.x +
    //       organism.collision.x +
    //       organism.collision.width / 2 -
    //       (collision.x + collision.width / 2);
    //     const distanceY =
    //       organism.position.y +
    //       organism.collision.y +
    //       organism.collision.height / 2 -
    //       (collision.y + collision.height / 2);
    //     // Minimal distance between centers
    //     const widthX = organism.collision.width / 2 + collision.width / 2;
    //     const widthY = organism.collision.height / 2 + collision.height / 2;
    //     // Check if there is a collision
    //     if (Math.abs(distanceX) < widthX && Math.abs(distanceY) < widthY) {
    //       const overlapX = widthX - Math.abs(distanceX);
    //       const overlapY = widthY - Math.abs(distanceY);
    //       // Remove overlap
    //       if (overlapX < overlapY) {
    //         organism.position.x += distanceX > 0 ? overlapX : -overlapX;
    //         return;
    //       }
    //       organism.position.y += distanceY > 0 ? overlapY : -overlapY;
    //     }
    //   }
    // });
    // // Scene limits on the x axis
    // if (organism.position.x < 0) {
    //   organism.position.x = 0;
    // } else if (
    //   organism.position.x >
    //   this.tilemap.columns * TILE_SIZE - organism.sprite.width
    // ) {
    //   organism.position.x =
    //     this.tilemap.columns * TILE_SIZE - organism.sprite.width;
    // }
    // // Scene limits on the y axis
    // if (organism.position.y < 0) {
    //   organism.position.y = 0;
    // } else if (
    //   organism.position.y >
    //   this.tilemap.rows * TILE_SIZE - organism.sprite.height
    // ) {
    //   organism.position.y =
    //     this.tilemap.rows * TILE_SIZE - organism.sprite.height;
    // }
  }
}
