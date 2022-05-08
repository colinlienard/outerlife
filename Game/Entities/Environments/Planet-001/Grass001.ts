import Entity from '../../Entity';

class Grass001 extends Entity {
  position = {
    x: 0,
    y: 0,
  };

  sprite = {
    image: new Image(),
    source: 'environments-001',
    width: 16,
    height: 16,

    sourceX: 0,
    sourceY: 160,
  };

  constructor(x: number, y: number) {
    super();
    super.init(x, y);
  }
}

export default Grass001;
