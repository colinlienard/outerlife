import Player from './Entities/Organisms/Player';
import Entity from './Entities/Entity';
import Planet1 from './Tilemaps/Planet';
import Terrain from './Entities/Terrains/Terrain';
import TerrainTiles from './Entities/Terrains/TerrainTiles';
import EnvironmentTiles from './Entities/Environments/EnvironmentTiles';
import { Keys, Tilemap } from './types';

class Scene {
  entities: Entity[] = [];

  player;

  terrains: Terrain[] = [];

  tilemap: Tilemap = Planet1;

  constructor() {
    this.player = new Player((entity: Entity) => this.spawn(entity));
    this.entities.push(this.player);
  }

  animate() {
    this.entities.forEach((entity) => {
      const { animator } = entity;
      if (animator) {
        // Execute the following every {specified number} frames per second
        if (
          animator.frameWaiter >=
          60 / animator.currentAnimation.framesPerSecond
        ) {
          animator.frameWaiter = 0;

          // Move forward in the animation
          if (animator.column < animator.currentAnimation.frameNumber - 1) {
            animator.column += 1;
          }

          // Delete instance after its animation
          else if (animator.currentAnimation.once) {
            delete this.entities[this.entities.indexOf(entity)];
          }

          // Reset animation
          else {
            animator.column = 0;
          }
        } else {
          animator.frameWaiter += 1;
        }
      }
    });
  }

  buildMap(tileSize: number) {
    for (let row = 0; row < this.tilemap.rows; row += 1) {
      for (let column = 0; column < this.tilemap.columns; column += 1) {
        const tile = row * this.tilemap.columns + column;

        // Build terrain
        const terrain = TerrainTiles[this.tilemap.terrains[tile]];
        this.terrains.push(
          new Terrain(
            column * tileSize,
            row * tileSize,
            terrain.source,
            terrain.x,
            terrain.y
          )
        );

        // Build environment
        const Environment = EnvironmentTiles[this.tilemap.environments[tile]];
        if (Environment) {
          this.entities.push(new Environment(column * 16, row * 16));
        }
      }
    }
  }

  updatePlayer(keys: Keys) {
    this.player.update(keys);
  }

  spawn(entity: Entity) {
    this.entities.push(entity);
  }

  ySort() {
    this.entities.sort((previous, current) =>
      previous.position.y + previous.sprite.height >
      current.position.y + current.sprite.height
        ? 1
        : -1
    );
  }
}

export default Scene;
