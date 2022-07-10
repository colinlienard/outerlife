import Entity from '../../Entity';

class Tree001 extends Entity {
  collider = {
    x: 20,
    y: 68,
    width: 14,
    height: 12,
  };

  position = {
    x: 0,
    y: 0,
  };

  sprite = {
    source: '/sprites/environments-001.png',
    width: 64,
    height: 80,

    sourceX: 0,
    sourceY: 0,

    shadow: {
      x: 0,
      y: 68,
      width: 64,
      height: 16,
      sourceX: 0,
      sourceY: 80,
    },
  };

  constructor(x: number, y: number) {
    super();
    super.init(x, y);
  }
}

export default Tree001;
