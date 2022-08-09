import { Component } from '~~/game/utils';

export class Dash implements Component {
  readonly distance: number;

  readonly recoveryTime: number;

  readonly speed: number;

  dashing = false;

  moved = 0;

  constructor(distance: number, speed: number, recoveryTime: number) {
    this.distance = distance;
    this.recoveryTime = recoveryTime;
    this.speed = speed;
  }

  reset() {
    this.dashing = false;
    this.moved = 0;
  }
}
