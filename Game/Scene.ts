import Player from './Entities/Organisms/Player';
import Entity from './Entities/Entity';
import Planet1 from './Tilemaps/Planet';
import { Keys, Tilemap } from './types';
import Terrain from './Entities/Terrains/Terrain';
import TerrainTiles from './Entities/Terrains/TerrainTiles';

class Scene {
  entities: Entity[] = [];

  player;

  tilemap = {
    map: <Tilemap>Planet1,
    terrains: <Terrain[]>[],
  };

  constructor() {
    this.player = new Player((entity: Entity) => this.spawn(entity));
    this.entities.push(this.player);
  }

  animate() {
    this.entities.forEach((entity) => {
      const { sprite } = entity;

      // Execute the following every {specified number} frames per second
      if (sprite.frameWaiter >= 60 / sprite.currentAnimation.framesPerSecond) {
        sprite.frameWaiter = 0;

        // Move forward in the animation
        if (sprite.column < sprite.currentAnimation.frameNumber - 1) {
          sprite.column += 1;

          // Delete instance after its animation
        } else if (sprite.currentAnimation.once) {
          delete this.entities[this.entities.indexOf(entity)];

          // Reset animation
        } else {
          sprite.column = 0;
        }
      } else {
        sprite.frameWaiter += 1;
      }
    });
  }

  buildMap(tileSize: number) {
    for (let row = 0; row < this.tilemap.map.rows; row += 1) {
      for (let column = 0; column < this.tilemap.map.columns; column += 1) {
        const tile =
          TerrainTiles[
            this.tilemap.map.map[row * this.tilemap.map.columns + column]
          ];
        this.tilemap.terrains.push(
          new Terrain(
            column * tileSize,
            row * tileSize,
            tile.source,
            tile.x,
            tile.y
          )
        );
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
