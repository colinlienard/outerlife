import Entity from '../../Entity';

class Tree002 extends Entity {
  collider = {
    x: 24,
    y: 74,
    width: 16,
    height: 12,
  };

  position = {
    x: 0,
    y: 0,
  };

  sprite = {
    source: '/sprites/environments-001.png',
    width: 64,
    height: 86,

    sourceX: 64,
    sourceY: 0,

    shadow: {
      x: 0,
      y: 74,
      width: 64,
      height: 16,
      sourceX: 64,
      sourceY: 96,
    },
  };

  constructor(x: number, y: number) {
    super();
    super.init(x, y);
  }
}

export default Tree002;
