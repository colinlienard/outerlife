import { Input } from '~~/game/components';

export class PatrollerInput extends Input {
  constructor() {
    super();

    this.movements.down = true;
  }
}
