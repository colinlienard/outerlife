import { Component } from '~~/game/utils';
import { AnimationData, Animations, AnimationType } from './types';

export class Animation implements Component {
  readonly animations!: Animations;

  current: AnimationData;

  row = 0;

  column = 0;

  frameWaiter = 0;

  constructor(animations: Animations | AnimationData, defaultRow = 0) {
    if ('idle' in animations) {
      this.animations = animations as Animations;
      this.current = this.animations.idle;
    } else {
      this.current = animations as AnimationData;
    }

    this.row = defaultRow;
  }

  getCurrentAnimationType(): AnimationType {
    for (const type in this.animations) {
      if (this.current === this.animations[type as AnimationType]) {
        return type as AnimationType;
      }
    }

    throw new Error('Animation not found.');
  }

  reset() {
    this.column = 0;
    this.frameWaiter = 0;
  }
}
