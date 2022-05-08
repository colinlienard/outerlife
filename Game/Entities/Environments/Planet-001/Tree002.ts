import Entity from '../../Entity';

class Tree002 extends Entity {
  position = {
    x: 0,
    y: 0,
  };

  sprite = {
    image: new Image(),
    source: 'environments-001',
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
