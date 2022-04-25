import SceneElement from '../SceneElement';

class Dust extends SceneElement {
  animations = {
    poof: {
      frameStart: 1,
      frameNumber: 6,
      framesPerSecond: 16,
      once: true,
    },
  };

  position = {
    x: 0,
    y: 0,
  };

  sprite = {
    image: new Image(),
    source: 'dust',
    width: 7,
    height: 3,

    currentAnimation: this.animations.poof,
    row: 0,
    column: 0,
    frameWaiter: 0,
  };

  constructor(x: number, y: number) {
    super();

    this.sprite.image.src = `assets/sprites/${this.sprite.source}.png`;

    this.position.x = x - this.sprite.width / 2;
    this.position.y = y - this.sprite.height;
  }
}

export default Dust;
