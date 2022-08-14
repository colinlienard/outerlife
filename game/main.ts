import { environmentTiles, map002, terrainTiles, tilemapIndex } from './data';
import { Interaction, InvisibleWall, Patroller, Player } from './entities';
import {
  Animator,
  MeleeAttacker,
  Camera,
  Collider,
  Mover,
  Renderer,
  Dasher,
} from './systems';
import { ECS, Emitter, Entity, Settings, Terrain, Tilemap } from './utils';

export class Game extends ECS {
  protected entities: Entity[] = [];

  private tilemap: Tilemap = map002;

  fps = 0;

  paused = false;

  constructor(gameCanvas: HTMLCanvasElement, debugCanvas: HTMLCanvasElement) {
    super();

    const options = {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    };
    const gameContext = gameCanvas.getContext('webgl2', options);
    const debugContext = debugCanvas.getContext('2d');

    this.add(new Dasher());
    this.add(new MeleeAttacker());
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

  private buildMap(playerX: number, playerY: number) {
    return new Promise((resolve) => {
      // Set scene settings
      Settings.scene.columns = this.tilemap.columns;
      Settings.scene.rows = this.tilemap.rows;
      Settings.scene.width = this.tilemap.columns * Settings.tileSize;
      Settings.scene.height = this.tilemap.rows * Settings.tileSize;

      // Reset the scene
      this.entities = [];

      // Prepare terrains for the renderer
      const terrains: Terrain[] = [];

      // Build the scene
      for (let row = 0; row < this.tilemap.rows; row += 1) {
        for (let column = 0; column < this.tilemap.columns; column += 1) {
          const tile = row * this.tilemap.columns + column;

          // Build terrain
          const terrain = terrainTiles[this.tilemap.terrains[tile]];
          terrains.push({
            source: terrain.source,
            sourceX: terrain.x,
            sourceY: terrain.y,
            x: column * Settings.tileSize,
            y: row * Settings.tileSize,
          });
          if (terrain.collision) {
            const { x, y, width, height } = terrain.collision;
            this.entities.push(
              new InvisibleWall(
                x + column * Settings.tileSize,
                y + row * Settings.tileSize,
                width,
                height
              )
            );
          }

          // Build environments
          const Environment = environmentTiles[this.tilemap.environments[tile]];
          if (Environment) {
            const environment = new Environment(
              column * Settings.tileSize,
              row * Settings.tileSize
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

      this.entities.push(new Patroller(350, 300));

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

  private loop(time = 0, oldTime = 0) {
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

  private setEvents() {
    // Add entity to the scene
    Emitter.on('spawn', (entity) => {
      this.entities.push(entity);
      this.setSystemsEntities();
    });

    // Remove entity from the scene
    Emitter.on('despawn', (entity) => {
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

    // Resize
    window.addEventListener('resize', () => {
      this.get(Renderer).resize();
      this.get(Camera).resize();
    });
  }

  private switchMap(map: string, playerX: number, playerY: number) {
    setTimeout(() => {
      this.entities = [];
      this.setSystemsEntities();

      this.tilemap = tilemapIndex[map];
      this.buildMap(playerX, playerY);
      this.setSystemsEntities();
    }, Settings.transitionDuration);
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }
}
