import { environmentTiles, map002, terrainTiles, tilemapIndex } from './data';
import { Interaction, InvisibleWall, Patroller, Player } from './entities';
import {
  AISystem,
  AnimationSystem,
  CameraSystem,
  CollisionSystem,
  MovementSystem,
  PlayerSystem,
  RenderSystem,
} from './systems';
import { ECS, Emitter, Settings, Terrain, Tilemap } from './utils';

export class Game extends ECS {
  private tilemap: Tilemap = map002;

  fps = 0;

  paused = false;

  constructor(gameCanvas: HTMLCanvasElement, debugCanvas: HTMLCanvasElement) {
    super();

    // Setup rendering context
    const options = {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    };
    const gameContext = gameCanvas.getContext('webgl2', options);
    const debugContext = debugCanvas.getContext('2d');

    // Setup systems
    this.add(new PlayerSystem());
    this.add(new AISystem());
    this.add(new MovementSystem());
    this.add(new CollisionSystem());
    this.add(new AnimationSystem());
    this.add(new CameraSystem());
    this.add(
      new RenderSystem(
        gameContext as WebGL2RenderingContext,
        debugContext as CanvasRenderingContext2D
      )
    );

    // Create the world and start the game
    (async () => {
      await this.buildMap(300, 300);

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

      // Reset world
      this.get(CollisionSystem).reset();
      this.get(RenderSystem).reset();

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
            this.addEntity(
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
            this.addEntity(
              new Environment(
                column * Settings.tileSize,
                row * Settings.tileSize
              )
            );
          }
        }
      }

      this.get(RenderSystem).setTerrains(terrains);

      // Build interactions
      this.tilemap.interactions.forEach((interaction) => {
        this.addEntity(
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
      this.get(PlayerSystem).setPlayer(player);
      this.addEntity(player);

      this.addEntity(new Patroller(400, 300));

      // Setup camera
      const camera = this.get(CameraSystem);
      camera.setPlayer(player);
      camera.init();

      // Load textures
      this.get(RenderSystem)
        .loadTextures(this.getEntities())
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
      this.update();
    }

    requestAnimationFrame((timeStamp) => this.loop(timeStamp, time));
  }

  private setEvents() {
    // Add entity to the scene
    Emitter.on('spawn', (entity) => {
      this.addEntity(entity);
    });

    // Remove entity from the scene
    Emitter.on('despawn', (id) => {
      this.deleteEntity(id);
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
      this.get(RenderSystem).resize();
      this.get(CameraSystem).resize();
    });
  }

  private switchMap(map: string, playerX: number, playerY: number) {
    this.get(AISystem).clear();

    setTimeout(() => {
      this.clearEntities();

      this.tilemap = tilemapIndex[map];
      this.buildMap(playerX, playerY);
    }, Settings.transitionDuration);
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }
}
