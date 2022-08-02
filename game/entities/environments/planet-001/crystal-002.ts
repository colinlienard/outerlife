import { Entity } from '~~/game/utils';
import { Collision, Position, Sprite, SpriteLayers } from '~~/game/components';

export class Crystal002 extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new Collision('environment', 4, 22, 26, 10));
    this.add(new Position(x, y, 32, 32));
    this.add(new Sprite('/sprites/environments-001.png', 48, 112, 32, 32));
    this.add(
      new SpriteLayers([
        {
          source: '/sprites/environments-001.png',
          sourceX: 48,
          sourceY: 144,
          width: 32,
          height: 16,
          x: 0,
          y: 22,
          rotation: 0,
          depth: -1,
        },
      ])
    );
  }
}
