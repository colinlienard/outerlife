import {
  AIComponent,
  AnimationComponent,
  CollisionComponent,
  InputComponent,
  MeleeAttackComponent,
  MovementComponent,
  PositionComponent,
  SpriteComponent,
  SpriteLayersComponent,
} from '~~/game/components';
import { Entity } from '~~/game/utils';

export class Patroller extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new AIComponent(x, y, 100, 150, 50, 30));
    this.add(
      new AnimationComponent(
        {
          idle: {
            frameStart: 1,
            frameNumber: 6,
            framesPerSecond: 4,
          },
          run: {
            frameStart: 7,
            frameNumber: 4,
            framesPerSecond: 5,
          },
          'anticipation-attack': {
            frameStart: 11,
            frameNumber: 4,
            framesPerSecond: 8,
          },
          'melee-attack': {
            frameStart: 15,
            frameNumber: 4,
            framesPerSecond: 8,
            once: () => {
              this.get(MeleeAttackComponent).reset();
              this.get(MovementComponent).blocked = false;
              this.get(InputComponent).attack.doing = false;
              this.get(AIComponent).state = 'aggro';
              this.get(AIComponent).framesToWait = 0;
            },
          },
        },
        1
      )
    );
    this.add(new CollisionComponent('organism', 10, 26, 12, 8));
    this.add(new InputComponent());
    this.add(new MeleeAttackComponent(24, 3, 0.2));
    this.add(new MovementComponent(0.4, 0.02, 0.04));
    this.add(new PositionComponent(x, y, 32, 32));
    this.add(new SpriteComponent('/sprites/patroller.png', 0, 0, 32, 32));
    this.add(
      new SpriteLayersComponent([
        {
          source: '/sprites/patroller.png',
          sourceX: 0,
          sourceY: 128,
          width: 12,
          height: 5,
          x: 10,
          y: 29,
          rotation: 0,
          depth: -1,
        },
      ])
    );
  }
}
