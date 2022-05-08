import Crystal001 from './Planet-001/Crystal001';
import Crystal002 from './Planet-001/Crystal002';
import Environment from './Environment';
import Grass001 from './Planet-001/Grass001';
import Grass002 from './Planet-001/Grass002';
import Grass003 from './Planet-001/Grass003';
import Tree001 from './Planet-001/Tree001';
import Tree002 from './Planet-001/Tree002';

const EnvironmentTiles: {
  [key: string]: typeof Environment;
} = {
  '001': Tree001,
  '002': Tree002,
  '003': Crystal001,
  '004': Crystal002,
  '005': Grass001,
  '006': Grass002,
  '007': Grass003,
};

export default EnvironmentTiles;
