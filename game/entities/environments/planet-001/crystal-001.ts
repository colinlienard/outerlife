import { Entity } from '~~/game/utils';
import { Collision, Position, Sprite, SpriteLayers } from '~~/game/components';

export class Crystal001 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new Collision('environment', 8, 35, 28, 12));
    this.add(new Position(x, y, 48, 48));
    this.add(new Sprite('/sprites/environments-001.png', 0, 96, 48, 48));
    this.add(
      new SpriteLayers([
        {
          source: '/sprites/environments-001.png',
          sourceX: 0,
          sourceY: 144,
          width: 48,
          height: 10,
          x: 0,
          y: 40,
          depth: -1,
        },
      ])
    );
  }
}
