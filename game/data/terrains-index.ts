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
    [
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 10, y: 10, width: 12, height: 12 },
      { x: 22, y: 22, width: 10, height: 10 },
    ],
  ],
  ['/sprites/desert-terrains.png', 128, 0],
  ['/sprites/desert-terrains.png', 0, 32],
  [
    '/sprites/desert-terrains.png',
    32,
    32,
    [
      { x: 0, y: 22, width: 10, height: 10 },
      { x: 10, y: 10, width: 12, height: 12 },
      { x: 22, y: 0, width: 10, height: 10 },
    ],
  ],
  [
    '/sprites/desert-terrains.png',
    64,
    32,
    [
      { x: 0, y: 22, width: 10, height: 10 },
      { x: 10, y: 10, width: 12, height: 12 },
      { x: 22, y: 0, width: 10, height: 10 },
    ],
  ],
  [
    '/sprites/desert-terrains.png',
    96,
    32,
    [{ x: 0, y: 0, width: 32, height: 32 }],
  ],
  [
    '/sprites/desert-terrains.png',
    128,
    32,
    [
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 10, y: 10, width: 12, height: 12 },
      { x: 22, y: 22, width: 10, height: 10 },
    ],
  ],
  ['/sprites/desert-terrains.png', 0, 64],
  ['/sprites/desert-terrains.png', 32, 64],
  ['/sprites/desert-terrains.png', 64, 64],
  [
    '/sprites/desert-terrains.png',
    96,
    64,
    [
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 10, y: 10, width: 12, height: 12 },
      { x: 22, y: 22, width: 10, height: 10 },
    ],
  ],
  [
    '/sprites/desert-terrains.png',
    128,
    64,
    [
      { x: 0, y: 22, width: 10, height: 10 },
      { x: 10, y: 10, width: 12, height: 12 },
      { x: 22, y: 0, width: 10, height: 10 },
    ],
  ],
  [
    '/sprites/desert-terrains.png',
    0,
    96,
    [{ x: 0, y: 0, width: 2, height: 32 }],
  ],
  [
    '/sprites/desert-terrains.png',
    32,
    96,
    [{ x: 30, y: 0, width: 2, height: 32 }],
  ],
  [
    '/sprites/desert-terrains.png',
    64,
    96,
    [{ x: 0, y: 0, width: 32, height: 4 }],
  ],
];
