export class Scene {
  //   buildMap(playerX: number, playerY: number) {
  //   // Reset the scene
  //   this.collisions = [];
  //   this.entities = [];
  //   this.interactions = [];
  //   this.organisms = [];
  //   this.terrains = [];
  //   // Build the scene
  //   for (let row = 0; row < this.tilemap.rows; row += 1) {
  //     for (let column = 0; column < this.tilemap.columns; column += 1) {
  //       const tile = row * this.tilemap.columns + column;
  //       // Build terrain
  //       const terrain = TerrainTiles[this.tilemap.terrains[tile]];
  //       this.terrains.push(
  //         new Terrain(
  //           column * TILE_SIZE,
  //           row * TILE_SIZE,
  //           terrain.source,
  //           terrain.x,
  //           terrain.y
  //         )
  //       );
  //       if (terrain.collision) {
  //         const { x, y, width, height } = terrain.collision;
  //         this.collisions.push({
  //           x: x + column * TILE_SIZE,
  //           y: y + row * TILE_SIZE,
  //           width,
  //           height,
  //         });
  //       }
  //       // Build environments
  //       const Environment = EnvironmentTiles[this.tilemap.environments[tile]];
  //       if (Environment) {
  //         const environment = new Environment(
  //           column * TILE_SIZE,
  //           row * TILE_SIZE
  //         );
  //         this.entities.push(environment);
  //         if (environment.collision) {
  //           this.collisions.push({
  //             x: environment.position.x + environment.collision.x,
  //             y: environment.position.y + environment.collision.y,
  //             width: environment.collision.width,
  //             height: environment.collision.height,
  //           });
  //         }
  //       }
  //     }
  //   }
  //   // Build interactions
  //   this.interactions = this.tilemap.interactions;
  //   // Add a new player instance
  //   this.player = new Player(playerX, playerY);
  //   this.entities.push(this.player);
  //   this.organisms.push(this.player);
  // }
  // switchMap(newMap: Tilemap, playerX: number, playerY: number) {
  //   window.dispatchEvent(new Event('start-scene-switch'));
  //   setTimeout(() => {
  //     this.tilemap = newMap;
  //     this.buildMap(playerX, playerY);
  //   }, TRANSITION_DURATION);
  // }
}
