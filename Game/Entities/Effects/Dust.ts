import Entity from '../Entity';

class Dust extends Entity {
  animations = {
    poof: {
      frameStart: 1,
      frameNumber: 6,
      framesPerSecond: 16,
      once: true,
    },
  };

  animator = {
    currentAnimation: this.animations.poof,
    row: 0,
    column: 0,
    frameWaiter: 0,
  };

  position = {
    x: 0,
    y: 0,
  };

  sprite = {
    texture: null,
    source: 'dust',
    width: 7,
    height: 3,
  };

  constructor(x: number, y: number) {
    super();
    super.init(x, y);
  }
}

export default Dust;
