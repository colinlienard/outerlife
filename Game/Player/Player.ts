import { Animation, Animations, Direction, Keys } from '../types';

class Player {
  readonly animations: Animations = {
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

  position = {
    x: 0,
    y: 0,
    direction: <Direction>['down', null],
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

    currentAnimation: <Animation>this.animations.idle,
    row: 0,
    column: 0,
    frameWaiter: 0,
  };

  constructor() {
    this.sprite.image.src = `assets/sprites/${this.sprite.source}.png`;
  }

  update(keys: Keys) {
    const keyDown = Object.values(keys).reduce(
      (previous, current) => previous || current
    );
    this.sprite.currentAnimation = keyDown
      ? this.animations.run
      : this.animations.idle;

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

    let { speed } = this.position;
    if (speed > 0 && (keys.up || keys.down) && (keys.left || keys.right)) {
      speed /= 1.25;
    }

    if (keys.up) {
      this.position.direction[0] = 'up';
      this.sprite.row = 1;
    } else if (keys.down) {
      this.position.direction[0] = 'down';
      this.sprite.row = 0;
    } else {
      this.position.direction[0] = null;
    }

    if (keys.left) {
      this.position.direction[1] = 'left';
      this.sprite.row = 3;
    } else if (keys.right) {
      this.position.direction[1] = 'right';
      this.sprite.row = 2;
    } else {
      this.position.direction[1] = null;
    }

    switch (this.position.direction[0]) {
      case 'up':
        this.position.y -= speed;
        break;
      case 'down':
        this.position.y += speed;
        break;
      default:
        break;
    }
    switch (this.position.direction[1]) {
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
