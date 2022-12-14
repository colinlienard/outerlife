import { AudioComponent } from '~~/game/components';
import { AudioManager, Entity, System } from '~~/game/utils';

export class AudioSystem extends System {
  protected readonly requiredComponents = [AudioComponent];

  private sources: string[] = [];

  constructor() {
    super();
    AudioManager.init();
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

  // eslint-disable-next-line class-methods-use-this
  update() {}
}
