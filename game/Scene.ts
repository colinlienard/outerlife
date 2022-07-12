import Player from './Entities/Organisms/Player';
import Entity from './Entities/Entity';
import Terrain from './Entities/Terrains/Terrain';
import TerrainTiles from './Entities/Terrains/TerrainTiles';
import EnvironmentTiles from './Entities/Environments/EnvironmentTiles';
import {
  Collision,
  Interaction,
  InteractionAction,
  Keys,
  Tilemap,
} from './types';
import { TILE_SIZE, TRANSITION_DURATION } from './globals';
import getDistance from './utils/getDistance';
import map002 from './Tilemaps/map002';
import tilemapIndex from './Tilemaps/tilemapIndex';

class Scene {
  collisions: Collision[] = [];

  entities: Entity[] = []; // Environments + organisms

  interactions: Interaction[] = [];

  organisms: Entity[] = [];

  player!: Player;

  terrains: Terrain[] = [];

  tilemap: Tilemap = map002;

  constructor() {
    window.addEventListener('spawn', (event) =>
      this.spawn((event as CustomEvent).detail)
    );
  }

  destructor() {
    window.removeEventListener('spawn', (event) =>
      this.spawn((event as CustomEvent).detail)
    );
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

  buildMap(playerX: number, playerY: number) {
    // Reset the scene
    this.collisions = [];
    this.entities = [];
    this.interactions = [];
    this.organisms = [];
    this.terrains = [];

    // Build the scene
    for (let row = 0; row < this.tilemap.rows; row += 1) {
      for (let column = 0; column < this.tilemap.columns; column += 1) {
        const tile = row * this.tilemap.columns + column;

        // Build terrain
        const terrain = TerrainTiles[this.tilemap.terrains[tile]];
        this.terrains.push(
          new Terrain(
            column * TILE_SIZE,
            row * TILE_SIZE,
            terrain.source,
            terrain.x,
            terrain.y
          )
        );
        if (terrain.collision) {
          const { x, y, width, height } = terrain.collision;
          this.collisions.push({
            x: x + column * TILE_SIZE,
            y: y + row * TILE_SIZE,
            width,
            height,
          });
        }

        // Build environments
        const Environment = EnvironmentTiles[this.tilemap.environments[tile]];
        if (Environment) {
          const environment = new Environment(
            column * TILE_SIZE,
            row * TILE_SIZE
          );
          this.entities.push(environment);
          if (environment.collision) {
            this.collisions.push({
              x: environment.position.x + environment.collision.x,
              y: environment.position.y + environment.collision.y,
              width: environment.collision.width,
              height: environment.collision.height,
            });
          }
        }
      }
    }

    // Build interactions
    this.interactions = this.tilemap.interactions;

    // Add a new player instance
    this.player = new Player(playerX, playerY);
    this.entities.push(this.player);
    this.organisms.push(this.player);
  }

  interact(action: InteractionAction) {
    if (action.sceneSwitch) {
      this.switchMap(
        tilemapIndex[action.sceneSwitch.map],
        action.sceneSwitch.playerX,
        action.sceneSwitch.playerY
      );
    }
  }

  performCollisions() {
    this.organisms.forEach((organism) => {
      this.collisions.forEach((collision) => {
        // Perform collisions only on collisions close to the organism
        if (
          getDistance(
            organism.position.x,
            organism.position.y,
            collision.x,
            collision.y
          ) < 48
        ) {
          // Distances between centers
          const distanceX =
            organism.position.x +
            organism.collision.x +
            organism.collision.width / 2 -
            (collision.x + collision.width / 2);
          const distanceY =
            organism.position.y +
            organism.collision.y +
            organism.collision.height / 2 -
            (collision.y + collision.height / 2);

          // Minimal distance between centers
          const widthX = organism.collision.width / 2 + collision.width / 2;
          const widthY = organism.collision.height / 2 + collision.height / 2;

          // Check if there is a collision
          if (Math.abs(distanceX) < widthX && Math.abs(distanceY) < widthY) {
            const overlapX = widthX - Math.abs(distanceX);
            const overlapY = widthY - Math.abs(distanceY);

            // Remove overlap
            if (overlapX < overlapY) {
              organism.position.x += distanceX > 0 ? overlapX : -overlapX;
              return;
            }
            organism.position.y += distanceY > 0 ? overlapY : -overlapY;
          }
        }
      });

      // Scene limits on the x axis
      if (organism.position.x < 0) {
        organism.position.x = 0;
      } else if (
        organism.position.x >
        this.tilemap.columns * TILE_SIZE - organism.sprite.width
      ) {
        organism.position.x =
          this.tilemap.columns * TILE_SIZE - organism.sprite.width;
      }

      // Scene limits on the y axis
      if (organism.position.y < 0) {
        organism.position.y = 0;
      } else if (
        organism.position.y >
        this.tilemap.rows * TILE_SIZE - organism.sprite.height
      ) {
        organism.position.y =
          this.tilemap.rows * TILE_SIZE - organism.sprite.height;
      }
    });
  }

  updatePlayer(keys: Keys) {
    this.player.update(keys);

    // Check interactions
    const { collision, position } = this.player;
    this.interactions.forEach((interaction) => {
      if (
        position.x + collision.x + collision.width > interaction.x &&
        position.x + collision.x < interaction.x + interaction.width &&
        position.y + collision.y + collision.height > interaction.y &&
        position.y + collision.y < interaction.y + interaction.height
      ) {
        if (!interaction.entered) {
          interaction.entered = true;
          this.interact(interaction.enter);
        }
      } else if (interaction.entered) {
        interaction.entered = false;
        if (interaction.leave) {
          this.interact(interaction.leave);
        }
      }
    });
  }

  switchMap(newMap: Tilemap, playerX: number, playerY: number) {
    window.dispatchEvent(new Event('start-scene-switch'));
    setTimeout(() => {
      this.tilemap = newMap;
      this.buildMap(playerX, playerY);
    }, TRANSITION_DURATION);
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
