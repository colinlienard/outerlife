import { Component } from '~~/game/utils';
import { GlowLayer, Layer, SpriteLayer } from './types';

export class LayersComponent implements Component {
  spriteLayers: SpriteLayer[] = [];

  glowLayers: GlowLayer[] = [];

  constructor(layers: Layer[]) {
    this.setLayers(layers);
  }

  getBackSprites() {
    return this.spriteLayers
      .filter((layer) => layer.render && layer.data.depth < 0)
      .sort((a, b) => a.data.depth - b.data.depth);
  }

  getFrontSprites() {
    return this.spriteLayers
      .filter((layer) => layer.render && layer.data.depth > 0)
      .sort((a, b) => a.data.depth - b.data.depth);
  }

  getGlow() {
    return this.glowLayers.filter((layer) => layer.render);
  }

  getAndSet(callback: (layers: Layer[]) => Layer[]) {
    const newLayers = callback([...this.spriteLayers, ...this.glowLayers]);
    this.setLayers(newLayers);
  }

  setLayers(layers: Layer[]) {
    this.spriteLayers = [];
    this.glowLayers = [];

    layers.forEach((layer) => {
      if (layer.type === 'sprite') {
        this.spriteLayers.push(layer);
        return;
      }
      this.glowLayers.push(layer);
    });
  }
}
