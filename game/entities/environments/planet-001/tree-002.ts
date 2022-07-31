import { Entity } from '~~/game/utils';
import { Collision, Position, Sprite, SpriteLayers } from '~~/game/components';

export class Tree002 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new Collision('environment', 24, 74, 16, 12));
    this.add(new Position(x, y, 64, 86));
    this.add(new Sprite('/sprites/environments-001.png', 64, 0, 64, 86));
    this.add(
      new SpriteLayers([
        {
          source: '/sprites/environments-001.png',
          sourceX: 64,
          sourceY: 96,
          width: 64,
          height: 16,
          x: 0,
          y: 74,
          depth: -1,
        },
      ])
    );
  }
}
