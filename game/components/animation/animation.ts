import { Component } from '~~/game/utils';

type Anim = {
  frameStart: number;
  frameNumber: number;
  framesPerSecond: number;
  once?: boolean;
};

type Anims = {
  idle: Anim;
  run: Anim;
};

export class Animation implements Component {
  readonly animations!: Anims;

  currentAnimation: Anim;

  row = 0;

  column = 0;

  frameWaiter = 0;

  constructor(animations: Anims | Anim, defaultRow = 0) {
    if ('idle' in animations) {
      this.animations = animations as Anims;
      this.currentAnimation = this.animations.idle;
    } else {
      this.currentAnimation = animations as Anim;
    }

    this.row = defaultRow;
  }
}
