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
  AudioComponent,
} from '~~/game/components';
import { Entity, getPointFromAngle } from '~~/game/utils';
import { Damage } from '~~/game/entities';
import { AudioManager, EventManager } from '~~/game/managers';

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
            action: () => this.emitFootstepsSound(),
            frame: 1,
            on: 'run',
          },
          {
            action: () => this.emitFootstepsSound(),
            frame: 3,
            on: 'run',
          },
          {
            action: () => this.emitFootstepsSound(),
            frame: 1,
            on: 'chase',
          },
          {
            action: () => this.emitFootstepsSound(),
            frame: 3,
            on: 'chase',
          },
          {
            action: () => this.emitAttackSound(),
            frame: 1,
            on: 'melee-attack',
          },
          {
            action: () => this.spawnDamage(),
            frame: 2,
            on: 'melee-attack',
          },
          {
            action: () => this.emitHitSound(),
            frame: 1,
            on: 'hit',
          },
          {
            action: () => {
              this.emitHitSound();
              this.emitDieSound();
            },
            frame: 1,
            on: 'dead',
          },
        ]
      )
    );
    this.add(
      new AudioComponent([
        '/sounds/robot-hit.wav',
        '/sounds/robot-attack.wav',
        '/sounds/robot-die.wav',
      ])
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

    const layerGlow = {
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
          color: [1, 0.2, 0.1],
          opacity: 0.5,
          size: 24,
          animation: {
            idle: layerGlow,
            hit: layerGlow,
            run: layerGlow,
            chase: layerGlow,
            'melee-attack-anticipation': layerGlow,
            'melee-attack': layerGlow,
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

  private getPosition() {
    return this.get(PositionComponent).getCenter();
  }

  private spawnDamage() {
    const damage = this.getDamage();
    EventManager.emit('spawn', damage);

    setTimeout(() => {
      EventManager.emit('despawn', damage.id);
    }, 166);
  }

  private getDamage() {
    const position = this.getPosition();
    const { angle } = this.get(MovementComponent);

    const { x, y } = getPointFromAngle(angle, position.x, position.y, 10);

    return new Damage(x, y, 24, 24, 30);
  }

  private emitFootstepsSound() {
    AudioManager.playSoundEffect('/sounds/desert-footsteps.wav', {
      pitchVariance: 200,
      spatialization: this.getPosition(),
    });
  }

  private emitAttackSound() {
    AudioManager.playSoundEffect('/sounds/robot-attack.wav', {
      pitchVariance: 200,
      spatialization: this.getPosition(),
    });
  }

  private emitHitSound() {
    AudioManager.playSoundEffect('/sounds/robot-hit.wav', {
      pitchVariance: 200,
      spatialization: this.getPosition(),
    });
  }

  private emitDieSound() {
    AudioManager.playSoundEffect('/sounds/robot-die.wav', {
      spatialization: this.getPosition(),
    });
  }
}
