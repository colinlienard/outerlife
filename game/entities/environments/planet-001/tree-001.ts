import { Entity } from '~~/game/utils';
import { Collision, Position, Sprite, SpriteLayers } from '~~/game/components';

export class Tree001 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new Collision('environment', 20, 68, 14, 12));
    this.add(new Position(x, y, 64, 80));
    this.add(new Sprite('/sprites/environments-001.png', 0, 0, 64, 80));
    this.add(
      new SpriteLayers([
        {
          source: '/sprites/environments-001.png',
          sourceX: 0,
          sourceY: 80,
          width: 64,
          height: 16,
          x: 0,
          y: 68,
          rotation: 0,
          depth: -1,
        },
      ])
    );
  }
}
