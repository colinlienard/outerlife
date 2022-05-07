import Entity from '../Entity';

class Tree001 extends Entity {
  position = {
    x: 0,
    y: 0,
  };

  sprite = {
    image: new Image(),
    source: 'environments-001',
    width: 64,
    height: 79,

    sourceX: 0,
    sourceY: 0,

    shadow: {
      x: 8,
      y: 68,
      width: 34,
      height: 15,
      sourceX: 8,
      sourceY: 81,
    },
  };

  constructor(x: number, y: number) {
    super();
    super.init(x, y);
  }
}

export default Tree001;
