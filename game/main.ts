import { environmentsIndex, organismsIndex, terrainsIndex } from './data';
import { AmbiantAudio, Interaction, InvisibleWall, Player } from './entities';
import { AudioManager, EventManager } from './managers';
import {
  AISystem,
  AnimationSystem,
  AudioSystem,
  CameraSystem,
  CollisionSystem,
  MovementSystem,
  ParticlesSystem,
  PlayerSystem,
  RenderSystem,
} from './systems';
import {
  Direction,
  ECS,
  GameMap,
  getAmbiantParticles,
  getColorCorrection,
  Settings,
  Terrain,
} from './utils';

export class Game extends ECS {
  private map!: GameMap;

  private freeze = false;

  paused = false;

  fps = 0;

  constructor(gameCanvas: HTMLCanvasElement) {
    super();

    // Setup systems
    this.add(new PlayerSystem());
    this.add(new AISystem());
    this.add(new MovementSystem());
    this.add(new CollisionSystem());
    this.add(new AnimationSystem());
    this.add(new ParticlesSystem());
    this.add(new CameraSystem());
    this.add(new RenderSystem(gameCanvas));
    this.add(new AudioSystem());

    // Setup custom events
    this.setEvents();

    // Create the world and start the game
    (async () => {
      await this.setMap('map-test');
      await this.buildMap(340, 230, 'down');

      this.loop();
    })();
  }

  private async setMap(source: string) {
    const map = (await import(`~~/game/data/maps/${source}.json`)) as GameMap;
    if (!map) {
      throw new Error(`Invalid map source: '${source}'.`);
    }
    this.map = map;
  }

  private async buildMap(
    playerX: number,
    playerY: number,
    playerDirection: Direction
  ) {
    // Set scene settings
    Settings.scene.columns = this.map.columns;
    Settings.scene.rows = this.map.rows;
    Settings.scene.width = this.map.columns * Settings.tileSize;
    Settings.scene.height = this.map.rows * Settings.tileSize;

    // Reset world
    this.get(CollisionSystem).reset();
    this.get(RenderSystem).reset();

    // Prepare terrains for the renderer
    const terrains: Terrain[] = [];

    // Build terrain
    for (let row = 0; row < this.map.rows; row += 1) {
      for (let column = 0; column < this.map.columns; column += 1) {
        const tile = this.map.terrains[row * this.map.columns + column];
        if (tile !== null) {
          const [source, sourceX, sourceY, collisions] = terrainsIndex[tile];
          const x = column * Settings.tileSize;
          const y = row * Settings.tileSize;

          terrains.push({
            source,
            sourceX,
            sourceY,
            x,
            y,
          });

          if (collisions) {
            collisions.forEach((collision) => {
              const { x: colX, y: colY, width, height } = collision;
              this.addEntity(
                new InvisibleWall(x + colX, y + colY, width, height)
              );
            });
          }
        }
      }
    }

    this.get(RenderSystem).setTerrains(terrains);

    // Build environments
    this.map.environments.forEach(([x, y, constructorId]) => {
      const Environment = environmentsIndex[constructorId];
      this.addEntity(new Environment(x, y));
    });

    // Build organisms
    this.map.organisms.forEach(([x, y, constructorId]) => {
      const Organism = organismsIndex[constructorId];
      this.addEntity(new Organism(x, y));
    });

    // Build interactions
    this.map.interactions.forEach((interaction) => {
      this.addEntity(
        new Interaction(
          interaction.x,
          interaction.y,
          interaction.width,
          interaction.height,
          interaction.data
        )
      );
    });

    // Add a new player instance
    const player = new Player(playerX, playerY, playerDirection);
    this.get(PlayerSystem).setPlayer(player);
    this.addEntity(player);

    // Setup camera
    const camera = this.get(CameraSystem);
    camera.setPlayer(player);
    camera.init();

    // Setup color correction
    const colorCorrection = getColorCorrection(this.map.postProcessing);
    if (colorCorrection) {
      this.get(RenderSystem).setColorCorrection(colorCorrection);
    }

    // Setup ambiant particles
    const ambiantParticles = getAmbiantParticles(this.map.postProcessing);
    if (ambiantParticles) {
      this.get(ParticlesSystem).setupAmbiantParticles(ambiantParticles);
    }

    // Setup ambiant sound and music
    if (this.map.ambiantSound) {
      this.addEntity(new AmbiantAudio(this.map.ambiantSound));
    }
    if (this.map.music) {
      this.addEntity(new AmbiantAudio(this.map.music));
    }

    await Promise.all([
      // Load textures
      this.get(RenderSystem).loadTextures(),
      // Load audio
      this.get(AudioSystem).loadAudioSources(),
    ]);

    // Play ambiant sound and music
    if (this.map.ambiantSound) {
      AudioManager.playEffect(this.map.ambiantSound, { loop: true });
      AudioManager.fade('in', 'effect', Settings.transitionDuration);
    }
    if (this.map.music) {
      AudioManager.playMusic(this.map.music);
    } else {
      AudioManager.clearMusic();
    }

    EventManager.emit('scene-loaded');
  }

  private loop(time = 0, oldTime = 0) {
    // Get frames per second
    if (Settings.debug) {
      this.fps =
        Math.round(
          (1000 / (performance.now() - oldTime) + Number.EPSILON) * 10
        ) / 10;
    }

    if (!this.paused && !this.freeze) {
      this.update();
    }

    requestAnimationFrame((timeStamp) => this.loop(timeStamp, time));
  }

  private setEvents() {
    // Add entity to the scene
    EventManager.on('spawn', (entity) => {
      this.addEntity(entity);
    });

    // Remove entity from the scene
    EventManager.on('despawn', (id) => {
      this.deleteEntity(id);
    });

    // Switch map
    EventManager.on(
      'switch-map',
      ({ map, playerX, playerY, playerDirection }) => {
        this.switchMap(map, playerX, playerY, playerDirection);
      }
    );

    EventManager.on('hit', () => {
      if (this.freeze) {
        return;
      }
      this.freeze = true;
      setTimeout(() => {
        this.freeze = false;
      }, 80);
    });

    // Resize
    window.addEventListener('resize', () => {
      this.get(RenderSystem).resize();
      this.get(CameraSystem).resize();
      this.get(ParticlesSystem).resize();
    });
  }

  private switchMap(
    map: string,
    playerX: number,
    playerY: number,
    playerDirection: Direction
  ) {
    this.get(AISystem).clear();

    AudioManager.fade('out', 'effect', Settings.transitionDuration);

    setTimeout(async () => {
      this.paused = true;
      this.clearEntities();
      AudioManager.clearEffects();

      await this.setMap(map);
      await this.buildMap(playerX, playerY, playerDirection);
      this.paused = false;
    }, Settings.transitionDuration);
  }

  pause() {
    this.paused = true;
    Settings.paused = true;
  }

  resume() {
    this.paused = false;
    setTimeout(() => {
      Settings.paused = false;
    }, 100);
  }
}
