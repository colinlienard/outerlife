import { Interaction, InvisibleWall, Player } from './entities';
import { TILE_SIZE } from './globals';
import EnvironmentTiles from './oldEntities/Environments/EnvironmentTiles';
import TerrainTiles from './oldEntities/Terrains/TerrainTiles';
import { Settings } from './settings';
import { Animator, Camera, Collider, Mover, Renderer } from './systems';
import map001 from './Tilemaps/map001';
import { Terrain, Tilemap } from './types';
import { ECS, Emitter, Entity } from './utils';

export class Game extends ECS {
  entities: Entity[] = [];

  paused = false;

  fps = 0;

  tilemap: Tilemap = map001;

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

    this.buildMap(100, 100);

    this.setSystemsEntities();

    this.setEvents();

    (async () => {
      await this.get(Renderer).loadTextures(this.entities);
      this.loop();
    })();
  }

  setEvents() {
    Emitter.on('spawn', (entity: Entity) => {
      this.entities.push(entity);
      this.setSystemsEntities();
    });

    Emitter.on('despawn', (entity: Entity) => {
      delete this.entities[this.entities.indexOf(entity)];
      this.setSystemsEntities();
    });
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
          interaction.height
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
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }
}
