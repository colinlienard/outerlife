import { AudioComponent } from '~~/game/components';
import { Entity } from '~~/game/utils';

export class AmbiantAudio extends Entity {
  constructor(source: string) {
    super();
    this.add(new AudioComponent([source]));
  }
}
