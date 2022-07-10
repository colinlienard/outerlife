import { Component } from '~~/game/utils';

type Animation = {
  frameStart: number;
  frameNumber: number;
  framesPerSecond: number;
};

type Animations = {
  [key: string]: Animation;
};

export class Animator implements Component {
  readonly animations!: Animations;

  currentAnimation: Animation;

  row = 1;

  column = 0;

  frameWaiter = 0;

  constructor(animations: Animations) {
    this.animations = animations;
    this.currentAnimation = this.animations.idle;
  }

  setRow(row: number) {
    this.row = row;
  }

  setAnimation(animation: Animation) {
    this.currentAnimation = animation;
  }

  update() {
    // Execute the following every {specified number} frames per second
    if (this.frameWaiter >= 60 / this.currentAnimation.framesPerSecond) {
      this.frameWaiter = 0;

      // Move forward in the animation
      if (this.column < this.currentAnimation.frameNumber - 1) {
        this.column += 1;
      }

      // Delete instance after its animation
      // else if (this.currentAnimation.once) {
      //   delete this.entities[this.entities.indexOf(entity)];
      // }

      // Reset animation
      else {
        this.column = 0;
      }
    } else {
      this.frameWaiter += 1;
    }
  }
}
