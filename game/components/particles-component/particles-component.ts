import { Component } from '~~/game/utils';
import { Particle } from './types';

export class ParticlesComponent implements Component {
  readonly color: number;

  readonly speed: number;

  readonly duration: number;

  readonly angle: number;

  readonly timeBetween: number;

  areaX: number;

  areaY: number;

  areaWidth: number;

  areaHeight: number;

  list: Particle[] = [{ x: 0, y: 0, time: 0 }];

  time = 0;

  constructor(
    color: number,
    speed: number,
    duration: number,
    angle: number,
    timeBetween: number,
    areaX: number,
    areaY: number,
    areaWidth: number,
    areaHeight: number
  ) {
    this.color = color;
    this.speed = speed;
    this.duration = duration;
    this.angle = angle;
    this.timeBetween = timeBetween;
    this.areaX = areaX;
    this.areaY = areaY;
    this.areaWidth = areaWidth;
    this.areaHeight = areaHeight;
  }
}
