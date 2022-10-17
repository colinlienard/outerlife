import { Component } from '~~/game/utils';

export class MeleeAttackComponent implements Component {
  readonly speed: number;

  readonly deceleration: number;

  readonly spawnDustEffect: boolean;

  constructor(speed: number, deceleration: number, spawnDustEffect = true) {
    this.speed = speed;
    this.deceleration = deceleration;
    this.spawnDustEffect = spawnDustEffect;
  }
}
