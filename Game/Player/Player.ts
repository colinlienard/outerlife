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

    currentAnimation: <Animation>this.animations.idle,
    row: 0,
    column: 0,
    frameWaiter: 0,

    behind: {
      x: 10,
      y: 30,
      width: 12,
      height: 4,
      sourceX: 0,
      sourceY: 128,
    },
  };

  constructor() {
    this.sprite.image.src = `assets/sprites/${this.sprite.source}.png`;

    this.sprite.row = 1;
  }

  update(keys: Keys) {
    // If a key is pressed
    const keyDown = Object.values(keys).reduce(
      (previous, current) => previous || current
    );
    this.sprite.currentAnimation = keyDown
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

    // Avoid player going too fast when running diagonally
    let { speed } = this.position;
    if (speed > 0 && (keys.up || keys.down) && (keys.left || keys.right)) {
      speed /= 1.25;
    }

    // Handle the direction of the player
    if (keys.up) {
      this.position.direction.y = 'up';
      this.sprite.row = 0;
    } else if (keys.down) {
      this.position.direction.y = 'down';
      this.sprite.row = 1;
    } else if (keyDown) {
      this.position.direction.y = null;
    }
    if (keys.left) {
      this.position.direction.x = 'left';
      this.sprite.row = 2;
    } else if (keys.right) {
      this.position.direction.x = 'right';
      this.sprite.row = 3;
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
