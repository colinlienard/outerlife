import { Events } from '~~/game/organisms/player/components';
import { Component, Entity } from '~~/game/utils';
import { Animator } from '../animator';
import { Position } from '../position';

type Direction = {
  x: null | 'left' | 'right';
  y: null | 'up' | 'down';
};

export class Movements implements Component {
  readonly entity: Entity;

  direction: Direction = {
    x: null,
    y: null,
  };

  speed: number = 0;

  readonly maxSpeed: number;

  readonly acceleration: number;

  readonly deceleration: number;

  constructor(
    entity: Entity,
    maxSpeed: number,
    acceleration: number,
    deceleration: number
  ) {
    this.entity = entity;
    this.maxSpeed = maxSpeed;
    this.acceleration = acceleration;
    this.deceleration = deceleration;
  }

  update() {
    const animator = this.entity.get(Animator);
    const position = this.entity.get(Position);
    const { keys } = this.entity.get(Events);

    // If a key is pressed
    const keyDown = Object.values(keys).reduce(
      (previous, current) => previous || current
    );
    animator.setAnimation(
      keyDown ? animator.animations.run : animator.animations.idle
    );

    // Handle easing of the speed (acceleration and deceleration)
    if (keyDown) {
      if (this.speed < this.maxSpeed) {
        this.speed += this.acceleration;
      } else {
        this.speed = this.maxSpeed;
      }
    } else if (this.speed > 0) {
      this.speed -= this.deceleration;
    } else {
      this.speed = 0;
    }

    // Spawn a dust when running
    // if (
    //   keyDown &&
    //   animator.frameWaiter === 0 &&
    //   (animator.column === 0 || animator.column === 4)
    // ) {
    //   spawn(
    //     new Dust(position.x + 8, position.y + this.sprite.height - 8)
    //   );
    // }

    // Avoid player going too fast when running diagonally
    let { speed } = this;
    if (speed > 0 && (keys.up || keys.down) && (keys.left || keys.right)) {
      speed /= 1.25;
    }

    // Handle the direction of the player
    if (keys.up) {
      this.direction.y = 'up';
      animator.setRow(0);
    } else if (keys.down) {
      this.direction.y = 'down';
      animator.setRow(1);
    } else if (keyDown) {
      this.direction.y = null;
    }
    if (keys.left) {
      this.direction.x = 'left';
      animator.setRow(2);
    } else if (keys.right) {
      this.direction.x = 'right';
      animator.setRow(3);
    } else if (keyDown) {
      this.direction.x = null;
    }

    // Update the position of the player
    switch (this.direction.y) {
      case 'up':
        position.changeY(-speed);
        break;
      case 'down':
        position.changeY(speed);
        break;
      default:
        break;
    }
    switch (this.direction.x) {
      case 'left':
        position.changeX(-speed);
        break;
      case 'right':
        position.changeX(speed);
        break;
      default:
        break;
    }
  }
}
