import { Component } from '~~/game/utils';

type Anim = {
  frameStart: number;
  frameNumber: number;
  framesPerSecond: number;
  once?: boolean;
};

type Anims = {
  [key: string]: Anim;
};

export class Animation implements Component {
  readonly animations!: Anims;

  currentAnimation: Anim;

  row = 1;

  column = 0;

  frameWaiter = 0;

  constructor(animations: Anims) {
    this.animations = animations;
    this.currentAnimation = this.animations.idle;
  }
}
