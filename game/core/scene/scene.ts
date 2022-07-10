export class Scene {
  //   buildMap(playerX: number, playerY: number) {
  //   // Reset the scene
  //   this.colliders = [];
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
  //       if (terrain.collider) {
  //         const { x, y, width, height } = terrain.collider;
  //         this.colliders.push({
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
  //         if (environment.collider) {
  //           this.colliders.push({
  //             x: environment.position.x + environment.collider.x,
  //             y: environment.position.y + environment.collider.y,
  //             width: environment.collider.width,
  //             height: environment.collider.height,
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
