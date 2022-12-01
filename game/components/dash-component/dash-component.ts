import { Component } from '~~/game/utils';

export class DashComponent implements Component {
  readonly speed: number;

  readonly duration: number;

  readonly deceleration: number;

  readonly spawnDustEffect: boolean;

  constructor(
    speed: number,
    duration: number,
    deceleration: number,
    spawnDustEffect = true
  ) {
    this.speed = speed;
    this.duration = duration;
    this.deceleration = deceleration;
    this.spawnDustEffect = spawnDustEffect;
  }
}
