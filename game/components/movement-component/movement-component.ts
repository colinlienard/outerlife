import { Component } from '~~/game/utils';
import { State } from './types';

export class MovementComponent implements Component {
  readonly maxSpeed: number;

  readonly acceleration: number;

  readonly deceleration: number;

  angle = 0;

  isMoving = false;

  speed = 0;

  state: State = 'still';

  constructor(maxSpeed: number, acceleration: number, deceleration: number) {
    this.maxSpeed = maxSpeed;
    this.acceleration = acceleration;
    this.deceleration = deceleration;
  }
}
