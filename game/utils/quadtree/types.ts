import { Box } from '../types';

export type QuadTreeItem = Box & {
  id: number;
};

export interface IQuadTree<T extends QuadTreeItem> extends Box {
  add(item: T): void;

  get(x: number, y: number, width: number, height: number): T[];

  getWithDuplicates(x: number, y: number, width: number, height: number): T[];

  delete(id: number): boolean;

  reset(x: number, y: number, width: number, height: number): void;
}
