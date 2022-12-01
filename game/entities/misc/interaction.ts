import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Emitter, Entity, InteractionData } from '~~/game/utils';

export class Interaction extends Entity {
  data: InteractionData;

  entered = false;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    data: InteractionData
  ) {
    super();
    this.add(
      new CollisionComponent([
        {
          type: 'interaction',
          x: 0,
          y: 0,
          width,
          height,
        },
      ])
    );
    this.add(new PositionComponent(x, y));
    this.add(new SpriteComponent('/sprites/player.png', 0, 0, 0, 0)); // Fake sprite so that its collision can be rendered

    this.data = data;
  }

  enter() {
    switch (this.data.type) {
      case 'switch-map': {
        const { map, playerX, playerY, playerDirection } = this.data;
        Emitter.emit('switch-map', { map, playerX, playerY, playerDirection });
        break;
      }

      default:
        break;
    }
  }
}
