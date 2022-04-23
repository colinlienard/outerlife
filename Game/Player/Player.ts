import { Animation, Animations } from '../types';

class Player {
  sprite = {
    image: new Image(),
    source: 'player',
    width: 32,
    height: 32,

    currentAnimation: <Animation | null>null,
    row: 0,
    column: 5,
    frameWaiter: 0,
  };

  animations: Animations = {
    idle: {
      frameNumber: 7,
      framePerSecond: 8,
    },
  };

  constructor() {
    this.sprite.image.src = `assets/sprites/${this.sprite.source}.png`;

    this.sprite.currentAnimation = this.animations.idle;
  }
}

export default Player;
