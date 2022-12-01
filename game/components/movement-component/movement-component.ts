import { Component } from '~~/game/utils';

export class MovementComponent implements Component {
  readonly maxSpeed: number;

  readonly acceleration: number;

  readonly deceleration: number;

  angle: number;

  speed = 0;

  constructor(
    maxSpeed: number,
    acceleration: number,
    deceleration: number,
    angle = 90
  ) {
    this.maxSpeed = maxSpeed;
    this.acceleration = acceleration;
    this.deceleration = deceleration;
    this.angle = angle;
  }
}
