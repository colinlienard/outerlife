import { Component } from '~~/game/utils';
import { Direction } from './types';

export class Velocity implements Component {
  readonly maxSpeed: number;

  readonly acceleration: number;

  readonly deceleration: number;

  direction: Direction = {
    x: null,
    y: null,
    current: null,
  };

  speed = 0;

  constructor(maxSpeed: number, acceleration: number, deceleration: number) {
    this.maxSpeed = maxSpeed;
    this.acceleration = acceleration;
    this.deceleration = deceleration;
  }
}
