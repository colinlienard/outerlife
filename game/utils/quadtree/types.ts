import { Box } from '../types';

export interface IQuadTree<T extends Box> extends Box {
  add(item: T): void;

  clear(): void;

  get(x: number, y: number, width: number, height: number): T[];

  getWithDuplicates(x: number, y: number, width: number, height: number): T[];
}
