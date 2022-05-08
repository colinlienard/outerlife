import Entity from '../../Entity';

class Crystal002 extends Entity {
  position = {
    x: 0,
    y: 0,
  };

  sprite = {
    image: new Image(),
    source: 'environments-001',
    width: 32,
    height: 32,

    sourceX: 48,
    sourceY: 112,

    shadow: {
      x: 0,
      y: 22,
      width: 32,
      height: 16,
      sourceX: 48,
      sourceY: 144,
    },
  };

  constructor(x: number, y: number) {
    super();
    super.init(x, y);
  }
}

export default Crystal002;
