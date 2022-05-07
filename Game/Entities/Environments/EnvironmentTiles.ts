import Crystal001 from './Crystal001';
import Crystal002 from './Crystal002';
import Grass001 from './Grass001';
import Grass002 from './Grass002';
import Grass003 from './Grass003';
import Tree001 from './Tree001';
import Tree002 from './Tree002';

const EnvironmentTiles: {
  [key: string]: typeof Tree001 | typeof Grass001;
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
