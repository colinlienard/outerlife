import Entity from '../../Entity';

class Crystal001 extends Entity {
  collider = {
    x: 8,
    y: 35,
    width: 28,
    height: 12,
  };

  position = {
    x: 0,
    y: 0,
  };

  sprite = {
    image: new Image(),
    source: 'environments-001',
    width: 48,
    height: 48,

    sourceX: 0,
    sourceY: 96,

    shadow: {
      x: 0,
      y: 40,
      width: 48,
      height: 10,
      sourceX: 0,
      sourceY: 144,
    },
  };

  constructor(x: number, y: number) {
    super();
    super.init(x, y);
  }
}

export default Crystal001;
