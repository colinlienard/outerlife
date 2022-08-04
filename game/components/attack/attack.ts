import { Component } from '~~/game/utils';

export class Attack implements Component {
  readonly movement: number;

  readonly speed: number;

  attacking = false;

  moved = 0;

  constructor(movement: number, speed: number) {
    this.movement = movement;
    this.speed = speed;
  }

  reset() {
    this.attacking = false;
    this.moved = 0;
  }
}
