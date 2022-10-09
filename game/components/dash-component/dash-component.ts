import { Component } from '~~/game/utils';

export class DashComponent implements Component {
  readonly deceleration: number;

  readonly maxSpeed: number;

  dashing = false;

  speed: number;

  constructor(maxSpeed: number, deceleration: number) {
    this.deceleration = deceleration;
    this.maxSpeed = maxSpeed;
    this.speed = maxSpeed;
  }

  reset() {
    this.dashing = false;
    this.speed = this.maxSpeed;
  }
}
