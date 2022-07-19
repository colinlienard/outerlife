import { Interaction, InvisibleWall, Player } from './entities';
import { TILE_SIZE, TRANSITION_DURATION } from './globals';
import EnvironmentTiles from './oldEntities/Environments/EnvironmentTiles';
import TerrainTiles from './oldEntities/Terrains/TerrainTiles';
import { Settings } from './settings';
import { Animator, Camera, Collider, Mover, Renderer } from './systems';
import map002 from './Tilemaps/map002';
import tilemapIndex from './Tilemaps/tilemapIndex';
import { Terrain, Tilemap } from './types';
import { ECS, Emitter, Entity } from './utils';

export class Game extends ECS {
  entities: Entity[] = [];

  paused = false;

  fps = 0;

  tilemap: Tilemap = map002;

  constructor(gameCanvas: HTMLCanvasElement, debugCanvas: HTMLCanvasElement) {
    super();

    const options = {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    };
    const gameContext = gameCanvas.getContext('webgl2', options);
    const debugContext = debugCanvas.getContext('2d');

    this.add(new Mover());
    this.add(new Collider());
    this.add(new Animator());
    this.add(new Camera());
    this.add(
      new Renderer(
        gameContext as WebGL2RenderingContext,
        debugContext as CanvasRenderingContext2D
      )
    );

    (async () => {
      await this.buildMap(300, 300);

      this.setSystemsEntities();

      this.setEvents();

      this.loop();
    })();
  }

  setEvents() {
    // Add entity to the scene
    Emitter.on('spawn', (entity: Entity) => {
      this.entities.push(entity);
      this.setSystemsEntities();
    });

    // Remove entity from the scene
    Emitter.on('despawn', (entity: Entity) => {
      delete this.entities[this.entities.indexOf(entity)];
      this.setSystemsEntities();
    });

    // Switch map
    Emitter.on(
      'switch-map',
      ({
        map,
        playerX,
        playerY,
      }: {
        map: string;
        playerX: number;
        playerY: number;
      }) => {
        this.switchMap(map, playerX, playerY);
      }
    );
  }

  loop(time = 0, oldTime = 0) {
    // Get frames per second
    if (Settings.debug) {
      this.fps =
        Math.round(
          (1000 / (performance.now() - oldTime) + Number.EPSILON) * 10
        ) / 10;
    }

    if (!this.paused) {
      this.updateSystems();
    }

    requestAnimationFrame((timeStamp) => this.loop(timeStamp, time));
  }

  setSystemsEntities() {
    this.systems.forEach((system) => {
      system.setEntities(this.entities);
    });
  }

  buildMap(playerX: number, playerY: number) {
    return new Promise((resolve) => {
      // Set scene settings
      Settings.scene.columns = this.tilemap.columns;
      Settings.scene.rows = this.tilemap.rows;

      // Reset the scene
      this.entities = [];

      // Prepare terrains for the renderer
      const terrains: Terrain[] = [];

      // Build the scene
      for (let row = 0; row < this.tilemap.rows; row += 1) {
        for (let column = 0; column < this.tilemap.columns; column += 1) {
          const tile = row * this.tilemap.columns + column;

          // Build terrain
          const terrain = TerrainTiles[this.tilemap.terrains[tile]];
          terrains.push({
            source: terrain.source,
            sourceX: terrain.x,
            sourceY: terrain.y,
            x: column * TILE_SIZE,
            y: row * TILE_SIZE,
          });
          if (terrain.collision) {
            const { x, y, width, height } = terrain.collision;
            this.entities.push(
              new InvisibleWall(
                x + column * TILE_SIZE,
                y + row * TILE_SIZE,
                width,
                height
              )
            );
          }

          // Build environments
          const Environment = EnvironmentTiles[this.tilemap.environments[tile]];
          if (Environment) {
            const environment = new Environment(
              column * TILE_SIZE,
              row * TILE_SIZE
            );
            this.entities.push(environment);
          }
        }
      }

      this.get(Renderer).setTerrains(terrains);

      // Build interactions
      this.tilemap.interactions.forEach((interaction) => {
        this.entities.push(
          new Interaction(
            interaction.x,
            interaction.y,
            interaction.width,
            interaction.height,
            interaction.enter
          )
        );
      });

      // Add a new player instance
      const player = new Player(playerX, playerY);
      this.entities.push(player);

      // Setup camera
      const camera = this.get(Camera);
      camera.setPlayer(player);
      camera.init();

      // Load textures
      this.get(Renderer)
        .loadTextures(this.entities)
        .then(() => {
          Emitter.emit('scene-loaded');
          resolve(null);
        });
    });
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  switchMap(map: string, playerX: number, playerY: number) {
    setTimeout(() => {
      this.entities = [];
      this.setSystemsEntities();

      this.tilemap = tilemapIndex[map];
      this.buildMap(playerX, playerY);
      this.setSystemsEntities();
    }, TRANSITION_DURATION);
  }
}
