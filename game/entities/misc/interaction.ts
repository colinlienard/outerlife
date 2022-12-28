import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { EventManager } from '~~/game/managers';
import { Entity, InteractionData } from '~~/game/utils';

export class Interaction extends Entity {
  private activeNumber = 0;

  private activeTimeout: NodeJS.Timeout | null = null;

  readonly data: InteractionData;

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

  private enter() {
    switch (this.data.type) {
      case 'switch-map': {
        const { map, playerX, playerY, playerDirection } = this.data;
        EventManager.emit('switch-map', {
          map,
          playerX,
          playerY,
          playerDirection,
        });
        break;
      }

      default: {
        const { id } = this.data;
        console.log(`start dialogue with id ${id}`);
        break;
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private exit() {
    EventManager.emit('hide-prompt');
  }

  trigger() {
    if (!this.entered) {
      if (this.data.prompt) {
        EventManager.emit('show-prompt', this.data.prompt, () => this.enter());
      } else {
        this.enter();
      }
      this.entered = true;
    }

    this.activeNumber += 1;
    const previousNumber = this.activeNumber;

    this.activeTimeout = setTimeout(() => {
      if (previousNumber === this.activeNumber) {
        this.entered = false;
        this.exit();
      }
    }, 100);
  }
}
