import { Collision, Position, Sprite } from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Interaction extends Entity {
  // eslint-disable-next-line class-methods-use-this
  enter: () => void = () => null;

  entered = false;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    enter: () => void
  ) {
    super();
    this.add(new Collision('interaction', 0, 0, width, height));
    this.add(new Position(x, y));
    this.add(new Sprite('/sprites/player.png', 0, 0, 0, 0)); // Fake sprite so that its collision can be rendered

    this.enter = enter;
  }
}
