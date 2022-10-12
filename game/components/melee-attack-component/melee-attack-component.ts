import { Component } from '~~/game/utils';

export class MeleeAttackComponent implements Component {
  readonly speed: number;

  readonly deceleration: number;

  constructor(speed: number, deceleration: number) {
    this.speed = speed;
    this.deceleration = deceleration;
  }
}
