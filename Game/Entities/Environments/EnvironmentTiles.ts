import Tree001 from './Tree001';
import Tree002 from './Tree002';

const EnvironmentTiles: {
  [key: string]: typeof Tree001;
} = {
  '001': Tree001,
  '002': Tree002,
};

export default EnvironmentTiles;
