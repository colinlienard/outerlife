import { Component, Direction, EntityState } from '~~/game/utils';
import { AnimationAction, AnimationData, Animations } from './types';

export class AnimationComponent implements Component {
  readonly animations!: Animations;

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

  getCurrent(): EntityState {
    for (const type in this.animations) {
      if (this.current === this.animations[type as EntityState]) {
        return type as EntityState;
      }
    }

    throw new Error('Animation not found.');
  }

  set(type: EntityState) {
    const animation = this.animations[type];
    if (animation) {
      this.current = animation;
      this.column = 0;
      this.frameWaiter = 0;
    }
  }

  setDirection(direction: Direction) {
    switch (direction) {
      case 'up':
        this.row = 0;
        break;
      case 'down':
        this.row = 1;
        break;
      case 'left':
        this.row = 2;
        break;
      case 'right':
        this.row = 3;
        break;
      default:
        break;
    }
  }
}
