import { Component } from '~~/game/utils';
import {
  AnimationAction,
  AnimationData,
  Animations,
  AnimationType,
} from './types';

export class AnimationComponent implements Component {
  readonly animations!: Animations;

  old: AnimationData | null = null;

  current: AnimationData;

  row = 0;

  column = 0;

  frameWaiter = 0;

  actions?: AnimationAction[];

  constructor(
    animations: Animations | AnimationData,
    defaultRow?: number,
    actions?: AnimationAction[]
  ) {
    if ('idle' in animations) {
      this.animations = animations as Animations;
      this.current = this.animations.idle;
    } else {
      this.current = animations as AnimationData;
    }

    this.row = defaultRow || 0;
    this.actions = actions;
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
