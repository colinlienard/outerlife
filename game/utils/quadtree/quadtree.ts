import { Box } from '../types';
import { IQuadTree } from './types';

const MAX_ITEMS = 4;

export class QuadTree<T extends Box> implements IQuadTree<T> {
  x = 0;

  y = 0;

  width = 0;

  height = 0;

  private nodes:
    | [IQuadTree<T>, IQuadTree<T>, IQuadTree<T>, IQuadTree<T>]
    | null = null;

  private items: T[] | null = [];

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  add(item: T) {
    if (!this.intersects(item.x, item.y, item.width, item.height)) {
      return;
    }

    if (this.items) {
      if (this.items.length < MAX_ITEMS) {
        this.items.push(item);
        return;
      }

      this.split(item);
      return;
    }

    this.addToNode(item);
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

  clear() {
    this.nodes = null;
    this.items = [];
  }

  get(x: number, y: number, width: number, height: number) {
    if (!this.intersects(x, y, width, height)) {
      return [];
    }

    if (this.items) {
      return this.items;
    }

    const result: T[] = [];
    this.nodes?.forEach((node) => {
      result.push(...node.get(x, y, width, height));
    });
    return result;
  }

  private split(item: T) {
    const items = [...(this.items as T[]), item];
    this.items = null;

    const splitWidth = this.width / 2;
    const splitHeight = this.height / 2;

    const topLeft = new QuadTree<T>(this.x, this.y, splitWidth, splitHeight);
    const topRight = new QuadTree<T>(
      this.x + splitWidth,
      this.y,
      splitWidth,
      splitHeight
    );
    const bottomLeft = new QuadTree<T>(
      this.x,
      this.y + splitHeight,
      splitWidth,
      splitHeight
    );
    const bottomRight = new QuadTree<T>(
      this.x + splitWidth,
      this.y + splitHeight,
      splitWidth,
      splitHeight
    );

    this.nodes = [topLeft, topRight, bottomLeft, bottomRight];

    items.forEach((i) => {
      this.addToNode(i);
    });
  }
}
