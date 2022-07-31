import { Component } from '~~/game/utils';

export type SpriteLayer = {
  readonly source: string;
  readonly sourceX: number;
  readonly sourceY: number;
  readonly width: number;
  readonly height: number;
  x: number;
  y: number;
  depth: number;
};

export class SpriteLayers implements Component {
  layers: SpriteLayer[] = [];

  constructor(layers: SpriteLayer[]) {
    this.layers = layers;
  }

  getBack() {
    return this.layers
      .filter((layer) => layer.depth < 0)
      .sort((a, b) => a.depth - b.depth);
  }

  getFront() {
    return this.layers
      .filter((layer) => layer.depth > 0)
      .sort((a, b) => a.depth - b.depth);
  }
}
