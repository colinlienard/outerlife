import Entity from '../../Entity';

class Grass003 extends Entity {
  position = {
    x: 0,
    y: 0,
  };

  sprite = {
    source: '/sprites/environments-001.png',
    width: 16,
    height: 16,

    sourceX: 32,
    sourceY: 160,
  };

  constructor(x: number, y: number) {
    super();
    super.init(x, y);
  }
}

export default Grass003;
