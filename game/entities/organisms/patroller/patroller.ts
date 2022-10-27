import {
  AIComponent,
  AnimationComponent,
  CollisionComponent,
  HealthComponent,
  MeleeAttackComponent,
  MovementComponent,
  PositionComponent,
  SpriteComponent,
  LayersComponent,
  StateMachineComponent,
} from '~~/game/components';
import { Emitter, Entity, getPointFromAngle } from '~~/game/utils';
import { Damage } from '../../misc/damage';

export class Patroller extends Entity {
  constructor(x: number, y: number) {
    super();
    this.add(new AIComponent(x, y, 100, 125, 75, 150, 50, 25));
    this.add(
      new AnimationComponent(
        {
          idle: {
            frameStart: 1,
            frameNumber: 6,
            framesPerSecond: 4,
          },
          hit: {
            frameStart: 1,
            frameNumber: 6,
            framesPerSecond: 4,
          },
          run: {
            frameStart: 7,
            frameNumber: 4,
            framesPerSecond: 5,
          },
          chase: {
            frameStart: 7,
            frameNumber: 4,
            framesPerSecond: 5,
          },
          'melee-attack-anticipation': {
            frameStart: 11,
            frameNumber: 4,
            framesPerSecond: 8,
            then: 'melee-attack',
          },
          'melee-attack': {
            frameStart: 15,
            frameNumber: 4,
            framesPerSecond: 8,
            then: 'chase',
          },
          dead: {
            frameStart: 19,
            frameNumber: 5,
            framesPerSecond: 6,
            then: 'die',
          },
        },
        1,
        [
          {
            action: () => this.spawnDamage(),
            frame: 2,
            on: 'melee-attack',
          },
        ]
      )
    );
    this.add(
      new CollisionComponent([
        {
          type: 'hitbox',
          x: 8,
          y: 26,
          width: 16,
          height: 8,
        },
        {
          type: 'ai-hurtbox',
          x: 6,
          y: 5,
          width: 20,
          height: 27,
        },
      ])
    );
    this.add(new HealthComponent(this.id, 100));

    const layerGlowIdle = {
      down: {
        x: 2,
        y: 0,
      },
      left: {
        x: 2,
        y: 0,
      },
      right: {
        x: 6,
        y: 0,
      },
    };
    this.add(
      new LayersComponent([
        {
          type: 'sprite',
          source: '/sprites/patroller.png',
          sourceX: 0,
          sourceY: 128,
          width: 12,
          height: 5,
          render: true,
          data: {
            x: 10,
            y: 29,
            rotation: 0,
            depth: -1,
          },
        },
        {
          type: 'glow',
          color: [1, 0.1, 0.1],
          opacity: 0.5,
          size: 24,
          animation: {
            idle: layerGlowIdle,
            hit: layerGlowIdle,
            run: layerGlowIdle,
            chase: layerGlowIdle,
            'melee-attack-anticipation': layerGlowIdle,
            'melee-attack': layerGlowIdle,
            dead: {
              down: [
                {
                  x: 2,
                  y: 0,
                },
                {
                  x: 2,
                  y: 0,
                },
              ],
            },
          },
          render: true,
          data: {
            x: 0,
            y: 0,
          },
        },
      ])
    );
    this.add(new MeleeAttackComponent(3.5, 0.25));
    this.add(new MovementComponent(0.4, 0.02, 0.04));
    this.add(new PositionComponent(x, y, 32, 32));
    this.add(new SpriteComponent('/sprites/patroller.png', 0, 0, 32, 32));
    this.add(new StateMachineComponent());
  }

  spawnDamage() {
    const damage = this.getDamage();
    Emitter.emit('spawn', damage);

    setTimeout(() => {
      Emitter.emit('despawn', damage.id);
    }, 166);
  }

  getDamage() {
    const position = this.get(PositionComponent).getCenter();
    const { angle } = this.get(MovementComponent);

    const { x, y } = getPointFromAngle(angle, position.x, position.y, 10);

    return new Damage(x, y, 24, 24, 30);
  }
}
