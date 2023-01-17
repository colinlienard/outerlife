import { Box } from '../utils';

export const terrainsIndex: [string, number, number, Box[]?][] = [
  // source, sourceX, sourceY, collisions
  ['/sprites/desert-terrains.png', 32, 0],
  [
    '/sprites/desert-terrains.png',
    64,
    0,
    [{ x: 0, y: 0, width: 32, height: 32 }],
  ],
  [
    '/sprites/desert-terrains.png',
    96,
    0,
    [{ x: 0, y: 0, width: 12, height: 32 }],
  ],
  [
    '/sprites/desert-terrains.png',
    128,
    0,
    [
      {
        x: 0,
        y: 0,
        width: 12,
        height: 32,
      },
    ],
  ],
  [
    '/sprites/desert-terrains.png',
    0,
    32,
    [
      {
        x: 20,
        y: 0,
        width: 12,
        height: 32,
      },
    ],
  ],
  [
    '/sprites/desert-terrains.png',
    32,
    32,
    [
      { x: 0, y: 0, width: 32, height: 8 },
      { x: 20, y: 8, width: 12, height: 24 },
    ],
  ],
  [
    '/sprites/desert-terrains.png',
    64,
    32,
    [
      { x: 0, y: 0, width: 32, height: 8 },
      { x: 0, y: 8, width: 12, height: 24 },
    ],
  ],
  [
    '/sprites/desert-terrains.png',
    96,
    32,
    [{ x: 0, y: 0, width: 32, height: 8 }],
  ],
  [
    '/sprites/desert-terrains.png',
    128,
    32,
    [{ x: 0, y: 0, width: 12, height: 8 }],
  ],
  [
    '/sprites/desert-terrains.png',
    0,
    64,
    [{ x: 20, y: 0, width: 12, height: 8 }],
  ],
  [
    '/sprites/desert-terrains.png',
    32,
    64,
    [{ x: 0, y: 0, width: 32, height: 32 }],
  ],
  [
    '/sprites/desert-terrains.png',
    64,
    64,
    [{ x: 0, y: 0, width: 32, height: 32 }],
  ],
  [
    '/sprites/desert-terrains.png',
    96,
    64,
    [{ x: 20, y: 0, width: 12, height: 32 }],
  ],
  ['/sprites/desert-terrains.png', 128, 64],
  ['/sprites/desert-terrains.png', 0, 96],
  [
    '/sprites/desert-terrains.png',
    32,
    96,
    [{ x: 0, y: 0, width: 32, height: 32 }],
  ],
  [
    '/sprites/desert-terrains.png',
    64,
    96,
    [
      { x: 0, y: 0, width: 4, height: 32 },
      { x: 28, y: 0, width: 4, height: 32 },
    ],
  ],
  ['/sprites/spaceship-interior.png', 0, 0],
  ['/sprites/spaceship-interior.png', 32, 0],
  ['/sprites/spaceship-interior.png', 64, 0],
  [
    '/sprites/spaceship-interior.png',
    96,
    0,
    [{ x: 0, y: 0, width: 32, height: 32 }],
  ],
];
