import { Component } from '~~/game/utils';

export class MovementComponent implements Component {
  readonly maxSpeed: number;

  readonly acceleration: number;

  readonly deceleration: number;

  readonly dash = {
    speed: 0,
    duration: 0,
    recoveryDuration: 0,
    recoveryDeceleration: 0,
  };

  angle = 90;

  speed = 0;

  constructor(
    maxSpeed: number,
    acceleration: number,
    deceleration: number,
    dashSpeed = 0,
    dashDuration = 0,
    dashRecoveryDuration = 0,
    dashRecoveryDeceleration = 0
  ) {
    this.maxSpeed = maxSpeed;
    this.acceleration = acceleration;
    this.deceleration = deceleration;
    this.dash.speed = dashSpeed;
    this.dash.duration = dashDuration;
    this.dash.recoveryDuration = dashRecoveryDuration;
    this.dash.recoveryDeceleration = dashRecoveryDeceleration;
  }
}
