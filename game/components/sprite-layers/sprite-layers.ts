import { Component } from '~~/game/utils';
import { SpriteLayer } from './types';

export class SpriteLayers implements Component {
  layers: SpriteLayer[] = [];

  constructor(layers: SpriteLayer[]) {
    this.layers = layers;
  }

  getAnimated() {
    return this.layers.filter((layer) => layer.animation !== undefined);
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

  setAnimated(layers: SpriteLayer[]) {
    this.layers = this.layers
      .filter((layer) => layer.animation === undefined)
      .concat(layers);
  }
}
