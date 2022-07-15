import { Collision } from '~~/game/types';

const TerrainTiles: {
  [key: string]: {
    source: string;
    x: number;
    y: number;
    collision?: Collision;
  };
} = {
  '001': {
    source: '/sprites/terrain-001.png',
    x: 0,
    y: 0,
  },
  '002': {
    source: '/sprites/terrain-001.png',
    x: 16,
    y: 0,
  },
  '003': {
    source: '/sprites/terrain-001.png',
    x: 32,
    y: 0,
  },
  '0035': {
    source: '/sprites/terrain-001.png',
    x: 48,
    y: 0,
  },
  '004': {
    source: '/sprites/terrain-001.png',
    x: 0,
    y: 16,
  },
  '005': {
    source: '/sprites/terrain-001.png',
    x: 16,
    y: 16,
  },
  '006': {
    source: '/sprites/terrain-001.png',
    x: 32,
    y: 16,
  },
  '007': {
    source: '/sprites/terrain-001.png',
    x: 48,
    y: 16,
  },
  '008': {
    source: '/sprites/terrain-001.png',
    x: 0,
    y: 32,
  },
  '009': {
    source: '/sprites/terrain-001.png',
    x: 16,
    y: 32,
  },
  '010': {
    source: '/sprites/terrain-001.png',
    x: 32,
    y: 32,
  },
  '011': {
    source: '/sprites/terrain-001.png',
    x: 48,
    y: 32,
  },
  '012': {
    source: '/sprites/terrain-001.png',
    x: 0,
    y: 48,
  },
  '013': {
    source: '/sprites/terrain-001.png',
    x: 16,
    y: 48,
  },
  '014': {
    source: '/sprites/terrain-001.png',
    x: 32,
    y: 48,
  },
  '015': {
    source: '/sprites/terrain-001.png',
    x: 48,
    y: 48,
  },
  '016': {
    source: '/sprites/terrain-001.png',
    x: 0,
    y: 64,
  },
  '017': {
    source: '/sprites/terrain-001.png',
    x: 16,
    y: 64,
  },
  '018': {
    source: '/sprites/terrain-001.png',
    x: 32,
    y: 64,
  },
  '020': {
    source: '/sprites/terrain-001.png',
    x: 48,
    y: 64,
  },
  '021': {
    source: '/sprites/terrain-001.png',
    x: 64,
    y: 0,
  },
  '022': {
    source: '/sprites/terrain-001.png',
    x: 80,
    y: 0,
  },
  '023': {
    source: '/sprites/terrain-001.png',
    x: 64,
    y: 16,
  },
  '024': {
    source: '/sprites/terrain-001.png',
    x: 80,
    y: 16,
  },
  '025': {
    source: '/sprites/terrain-001.png',
    x: 96,
    y: 0,
    collision: {
      x: 8,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '026': {
    source: '/sprites/terrain-001.png',
    x: 112,
    y: 0,
    collision: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
  '027': {
    source: '/sprites/terrain-001.png',
    x: 128,
    y: 0,
    collision: {
      x: 0,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '028': {
    source: '/sprites/terrain-001.png',
    x: 144,
    y: 0,
    collision: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
  '0285': {
    source: '/sprites/terrain-001.png',
    x: 160,
    y: 0,
    collision: {
      x: 0,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '029': {
    source: '/sprites/terrain-001.png',
    x: 96,
    y: 16,
    collision: {
      x: 8,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '030': {
    source: '/sprites/terrain-001.png',
    x: 112,
    y: 16,
  },
  '031': {
    source: '/sprites/terrain-001.png',
    x: 128,
    y: 16,
    collision: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
  '032': {
    source: '/sprites/terrain-001.png',
    x: 144,
    y: 16,
    collision: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
  '0325': {
    source: '/sprites/terrain-001.png',
    x: 160,
    y: 16,
    collision: {
      x: 0,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '033': {
    source: '/sprites/terrain-001.png',
    x: 96,
    y: 32,
    collision: {
      x: 8,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '034': {
    source: '/sprites/terrain-001.png',
    x: 112,
    y: 32,
  },
  '035': {
    source: '/sprites/terrain-001.png',
    x: 128,
    y: 32,
  },
  '036': {
    source: '/sprites/terrain-001.png',
    x: 144,
    y: 32,
  },
  '0365': {
    source: '/sprites/terrain-001.png',
    x: 160,
    y: 32,
    collision: {
      x: 0,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '037': {
    source: '/sprites/terrain-001.png',
    x: 96,
    y: 48,
    collision: {
      x: 8,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '038': {
    source: '/sprites/terrain-001.png',
    x: 112,
    y: 48,
    collision: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
  '039': {
    source: '/sprites/terrain-001.png',
    x: 128,
    y: 48,
    collision: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
  '040': {
    source: '/sprites/terrain-001.png',
    x: 144,
    y: 48,
    collision: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
  '0405': {
    source: '/sprites/terrain-001.png',
    x: 160,
    y: 48,
    collision: {
      x: 0,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '041': {
    source: '/sprites/terrain-001.png',
    x: 96,
    y: 80,
    collision: {
      x: 8,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '042': {
    source: '/sprites/terrain-001.png',
    x: 96,
    y: 64,
    collision: {
      x: 8,
      y: 8,
      width: 8,
      height: 8,
    },
  },
  '043': {
    source: '/sprites/terrain-001.png',
    x: 112,
    y: 64,
    collision: {
      x: 0,
      y: 8,
      width: 16,
      height: 8,
    },
  },
  '044': {
    source: '/sprites/terrain-001.png',
    x: 128,
    y: 64,
    collision: {
      x: 4,
      y: 4,
      width: 12,
      height: 12,
    },
  },
  '045': {
    source: '/sprites/terrain-001.png',
    x: 144,
    y: 64,
    collision: {
      x: 0,
      y: 4,
      width: 12,
      height: 12,
    },
  },
  '046': {
    source: '/sprites/terrain-001.png',
    x: 160,
    y: 64,
    collision: {
      x: 0,
      y: 8,
      width: 8,
      height: 8,
    },
  },
  '0465': {
    source: '/sprites/terrain-001.png',
    x: 160,
    y: 80,
    collision: {
      x: 0,
      y: 0,
      width: 8,
      height: 16,
    },
  },
};

export default TerrainTiles;
