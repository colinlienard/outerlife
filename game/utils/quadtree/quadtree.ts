import { IQuadTree, QuadTreeItem } from './types';

const MAX_ITEMS = 4;
const MAX_DEPTH = 4;

export class QuadTree<T extends QuadTreeItem> implements IQuadTree<T> {
  private items: Map<number, T> | null = new Map();

  private nodes:
    | [IQuadTree<T>, IQuadTree<T>, IQuadTree<T>, IQuadTree<T>]
    | null = null;

  x: number;

  y: number;

  width: number;

  height: number;

  depth: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number = 0
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.depth = depth;
  }

  private addToNode(item: T) {
    if (this.nodes) {
      this.nodes.forEach((node) => {
        node.add(item);
      });
    }
  }

  private intersects(x: number, y: number, width: number, height: number) {
    return (
      x + width > this.x &&
      x < this.x + this.width &&
      y + height > this.y &&
      y < this.y + this.height
    );
  }

  private split(item: T) {
    if (!this.items) {
      return;
    }

    const items = [...this.items.values(), item];
    this.items = null;

    const splitWidth = this.width / 2;
    const splitHeight = this.height / 2;
    const depth = this.depth + 1;

    const topLeft = new QuadTree<T>(
      this.x,
      this.y,
      splitWidth,
      splitHeight,
      depth
    );
    const topRight = new QuadTree<T>(
      this.x + splitWidth,
      this.y,
      splitWidth,
      splitHeight,
      depth
    );
    const bottomLeft = new QuadTree<T>(
      this.x,
      this.y + splitHeight,
      splitWidth,
      splitHeight,
      depth
    );
    const bottomRight = new QuadTree<T>(
      this.x + splitWidth,
      this.y + splitHeight,
      splitWidth,
      splitHeight,
      depth
    );

    this.nodes = [topLeft, topRight, bottomLeft, bottomRight];

    items.forEach((i) => {
      this.addToNode(i);
    });
  }

  add(item: T) {
    if (!this.intersects(item.x, item.y, item.width, item.height)) {
      return;
    }

    if (this.items) {
      if (this.items.size < MAX_ITEMS || this.depth === MAX_DEPTH) {
        this.items.set(item.id, item);
        return;
      }

      this.split(item);
      return;
    }

    this.addToNode(item);
  }

  delete(id: number) {
    if (this.items) {
      return this.items.delete(id);
    }

    return (
      this.nodes?.reduce(
        (previous, current) => current.delete(id) || previous,
        false
      ) || false
    );
  }

  get(x: number, y: number, width: number, height: number) {
    const items = this.getWithDuplicates(x, y, width, height);
    return [...new Set(items)];
  }

  getWithDuplicates(x: number, y: number, width: number, height: number) {
    if (!this.intersects(x, y, width, height)) {
      return [];
    }

    if (this.items) {
      return Array.from(this.items.values());
    }

    const result: T[] = [];
    this.nodes?.forEach((node) => {
      result.push(...node.get(x, y, width, height));
    });
    return result;
  }

  reset(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.items = new Map();
    this.nodes = null;
  }
}
