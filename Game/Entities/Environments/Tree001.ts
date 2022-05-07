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
    height: 96,
    sourceX: 0,
    sourceY: 0,
  };

  constructor() {
    super();
    super.init();
  }
}

export default Tree001;
