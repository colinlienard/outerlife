import Entity from '../Entity';
import { Direction, Keys } from '../../types';
import Dust from '../Effects/Dust';
import spawn from '~~/Game/utils/spawn';

class Player extends Entity {
  animations = {
    idle: {
      frameStart: 1,
      frameNumber: 7,
      framesPerSecond: 8,
    },
    run: {
      frameStart: 8,
      frameNumber: 8,
      framesPerSecond: 12,
    },
  };

  animator = {
    currentAnimation: this.animations.idle,
    row: 0,
    column: 0,
    frameWaiter: 0,
  };

  collider = {
    x: 10,
    y: 26,
    width: 12,
    height: 8,
  };

  position = {
    x: 0,
    y: 0,
    direction: <Direction>{
      x: null,
      y: null,
    },
    speed: 0,
    maxSpeed: 1.5,
    acceleration: 0.1,
    deceleration: 0.15,
  };

  sprite = {
    image: new Image(),
    source: 'player',
    width: 32,
    height: 32,

    shadow: {
      x: 10,
      y: 30,
      width: 12,
      height: 4,
      sourceX: 0,
      sourceY: 128,
    },
  };

  constructor(x: number, y: number) {
    super();
    super.init(x, y);

    this.animator.row = 1;
  }

  update(keys: Keys) {
    // If a key is pressed
    const keyDown = Object.values(keys).reduce(
      (previous, current) => previous || current
    );
    this.animator.currentAnimation = keyDown
      ? this.animations.run
      : this.animations.idle;

    // Handle easing of the speed (acceleration and deceleration)
    if (keyDown) {
      if (this.position.speed < this.position.maxSpeed) {
        this.position.speed += this.position.acceleration;
      } else {
        this.position.speed = this.position.maxSpeed;
      }
    } else if (this.position.speed > 0) {
      this.position.speed -= this.position.deceleration;
    } else {
      this.position.speed = 0;
    }

    // Spawn a dust when running
    if (
      keyDown &&
      this.animator.frameWaiter === 0 &&
      (this.animator.column === 0 || this.animator.column === 4)
    ) {
      spawn(
        new Dust(this.position.x + 8, this.position.y + this.sprite.height - 8)
      );
    }

    // Avoid player going too fast when running diagonally
    let { speed } = this.position;
    if (speed > 0 && (keys.up || keys.down) && (keys.left || keys.right)) {
      speed /= 1.25;
    }

    // Handle the direction of the player
    if (keys.up) {
      this.position.direction.y = 'up';
      this.animator.row = 0;
    } else if (keys.down) {
      this.position.direction.y = 'down';
      this.animator.row = 1;
    } else if (keyDown) {
      this.position.direction.y = null;
    }
    if (keys.left) {
      this.position.direction.x = 'left';
      this.animator.row = 2;
    } else if (keys.right) {
      this.position.direction.x = 'right';
      this.animator.row = 3;
    } else if (keyDown) {
      this.position.direction.x = null;
    }

    // Update the position of the player
    switch (this.position.direction.y) {
      case 'up':
        this.position.y -= speed;
        break;
      case 'down':
        this.position.y += speed;
        break;
      default:
        break;
    }
    switch (this.position.direction.x) {
      case 'left':
        this.position.x -= speed;
        break;
      case 'right':
        this.position.x += speed;
        break;
      default:
        break;
    }
  }
}

export default Player;
