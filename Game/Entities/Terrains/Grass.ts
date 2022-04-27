import Terrain from './Terrain';

class Grass extends Terrain {
  position = {
    x: 0,
    y: 0,
  };

  sprite = {
    image: new Image(),
    source: 'planet1',
    x: 0,
    y: 0,
  };

  constructor(x: number, y: number) {
    super();
    super.init(x, y);
  }
}

export default Grass;
