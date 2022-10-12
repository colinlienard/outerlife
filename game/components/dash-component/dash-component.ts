import { Component } from '~~/game/utils';

export class DashComponent implements Component {
  readonly speed: number;

  readonly duration: number;

  readonly deceleration: number;

  constructor(speed: number, duration: number, deceleration: number) {
    this.speed = speed;
    this.duration = duration;
    this.deceleration = deceleration;
  }
}
