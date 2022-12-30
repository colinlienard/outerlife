import { AudioComponent, PositionComponent } from '~~/game/components';
import { AudioManager, EventManager } from '~~/game/managers';
import { Entity, getRandomNumber, System } from '~~/game/utils';

export class AudioSystem extends System {
  protected readonly requiredComponents = [AudioComponent];

  private sources: string[] = [];

  constructor() {
    super();
    AudioManager.init();

    // Load UI sounds
    AudioManager.load('/sounds/ui/click.wav');
    AudioManager.load('/sounds/ui/hover.wav');
    AudioManager.load('/sounds/ui/dialogue-letter.wav');
  }

  add(entity: Entity) {
    super.add(entity);

    const { sources } = entity.get(AudioComponent);
    this.sources.push(...sources);
  }

  async loadAudioSources() {
    const promises = this.sources.map((source) => AudioManager.load(source));
    await Promise.all(promises);
  }

  update() {
    this.get().forEach((entity) => {
      const { recurringSounds } = entity.get(AudioComponent);

      if (!recurringSounds) {
        return;
      }

      recurringSounds.forEach((sound) => {
        if (sound.frameWaiter === sound.framesBetween) {
          sound.framesBetween = getRandomNumber(...sound.randomFramesBetween);
          sound.frameWaiter = 0;

          AudioManager.playEffect(sound.source, {
            ...sound,
            spatialization: sound.spatialization
              ? entity.get(PositionComponent).getCenter()
              : undefined,
          });

          return;
        }

        sound.frameWaiter += 1;
      });
    });

    // Update listener position for spatialization
    if (EventManager.exist('get-player-position')) {
      const [{ x, y }] = EventManager.emit('get-player-position');
      AudioManager.updateListenerPosition(x, y);
    }
  }
}
