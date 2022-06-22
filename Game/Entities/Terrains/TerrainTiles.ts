import { Collider } from '~~/Game/types';

const TerrainTiles: {
  [key: string]: { source: string; x: number; y: number; collider?: Collider };
} = {
  '001': {
    source: 'terrain-001',
    x: 0,
    y: 0,
  },
  '002': {
    source: 'terrain-001',
    x: 16,
    y: 0,
  },
  '003': {
    source: 'terrain-001',
    x: 32,
    y: 0,
  },
  '0035': {
    source: 'terrain-001',
    x: 48,
    y: 0,
  },
  '004': {
    source: 'terrain-001',
    x: 0,
    y: 16,
  },
  '005': {
    source: 'terrain-001',
    x: 16,
    y: 16,
  },
  '006': {
    source: 'terrain-001',
    x: 32,
    y: 16,
  },
  '007': {
    source: 'terrain-001',
    x: 48,
    y: 16,
  },
  '008': {
    source: 'terrain-001',
    x: 0,
    y: 32,
  },
  '009': {
    source: 'terrain-001',
    x: 16,
    y: 32,
  },
  '010': {
    source: 'terrain-001',
    x: 32,
    y: 32,
  },
  '011': {
    source: 'terrain-001',
    x: 48,
    y: 32,
  },
  '012': {
    source: 'terrain-001',
    x: 0,
    y: 48,
  },
  '013': {
    source: 'terrain-001',
    x: 16,
    y: 48,
  },
  '014': {
    source: 'terrain-001',
    x: 32,
    y: 48,
  },
  '015': {
    source: 'terrain-001',
    x: 48,
    y: 48,
  },
  '016': {
    source: 'terrain-001',
    x: 0,
    y: 64,
  },
  '017': {
    source: 'terrain-001',
    x: 16,
    y: 64,
  },
  '018': {
    source: 'terrain-001',
    x: 32,
    y: 64,
  },
  '020': {
    source: 'terrain-001',
    x: 48,
    y: 64,
  },
  '021': {
    source: 'terrain-001',
    x: 64,
    y: 0,
  },
  '022': {
    source: 'terrain-001',
    x: 80,
    y: 0,
  },
  '023': {
    source: 'terrain-001',
    x: 64,
    y: 16,
  },
  '024': {
    source: 'terrain-001',
    x: 80,
    y: 16,
  },
  '025': {
    source: 'terrain-001',
    x: 96,
    y: 0,
    collider: {
      x: 8,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '026': {
    source: 'terrain-001',
    x: 112,
    y: 0,
    collider: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
  '027': {
    source: 'terrain-001',
    x: 128,
    y: 0,
    collider: {
      x: 0,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '028': {
    source: 'terrain-001',
    x: 144,
    y: 0,
    collider: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
  '0285': {
    source: 'terrain-001',
    x: 160,
    y: 0,
    collider: {
      x: 0,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '029': {
    source: 'terrain-001',
    x: 96,
    y: 16,
    collider: {
      x: 8,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '030': {
    source: 'terrain-001',
    x: 112,
    y: 16,
  },
  '031': {
    source: 'terrain-001',
    x: 128,
    y: 16,
    collider: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
  '032': {
    source: 'terrain-001',
    x: 144,
    y: 16,
    collider: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
  '0325': {
    source: 'terrain-001',
    x: 160,
    y: 16,
    collider: {
      x: 0,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '033': {
    source: 'terrain-001',
    x: 96,
    y: 32,
    collider: {
      x: 8,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '034': {
    source: 'terrain-001',
    x: 112,
    y: 32,
  },
  '035': {
    source: 'terrain-001',
    x: 128,
    y: 32,
  },
  '036': {
    source: 'terrain-001',
    x: 144,
    y: 32,
  },
  '0365': {
    source: 'terrain-001',
    x: 160,
    y: 32,
    collider: {
      x: 0,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '037': {
    source: 'terrain-001',
    x: 96,
    y: 48,
    collider: {
      x: 8,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '038': {
    source: 'terrain-001',
    x: 112,
    y: 48,
    collider: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
  '039': {
    source: 'terrain-001',
    x: 128,
    y: 48,
    collider: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
  '040': {
    source: 'terrain-001',
    x: 144,
    y: 48,
    collider: {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    },
  },
  '0405': {
    source: 'terrain-001',
    x: 160,
    y: 48,
    collider: {
      x: 0,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '041': {
    source: 'terrain-001',
    x: 96,
    y: 80,
    collider: {
      x: 8,
      y: 0,
      width: 8,
      height: 16,
    },
  },
  '042': {
    source: 'terrain-001',
    x: 96,
    y: 64,
    collider: {
      x: 8,
      y: 8,
      width: 8,
      height: 8,
    },
  },
  '043': {
    source: 'terrain-001',
    x: 112,
    y: 64,
    collider: {
      x: 0,
      y: 8,
      width: 16,
      height: 8,
    },
  },
  '044': {
    source: 'terrain-001',
    x: 128,
    y: 64,
    collider: {
      x: 4,
      y: 4,
      width: 12,
      height: 12,
    },
  },
  '045': {
    source: 'terrain-001',
    x: 144,
    y: 64,
    collider: {
      x: 0,
      y: 4,
      width: 12,
      height: 12,
    },
  },
  '046': {
    source: 'terrain-001',
    x: 160,
    y: 64,
    collider: {
      x: 0,
      y: 8,
      width: 8,
      height: 8,
    },
  },
  '0465': {
    source: 'terrain-001',
    x: 160,
    y: 80,
    collider: {
      x: 0,
      y: 0,
      width: 8,
      height: 16,
    },
  },
};

export default TerrainTiles;
