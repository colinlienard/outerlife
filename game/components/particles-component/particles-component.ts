import { Component } from '~~/game/utils';
import { Particle } from './types';

export class ParticlesComponent implements Component {
  readonly color: number;

  readonly speed: number;

  readonly duration: number;

  readonly timeBetween: number;

  readonly areaWidth: number;

  readonly areaHeight: number;

  readonly areaX: number;

  readonly areaY: number;

  particles: Particle[] = [{ x: 0, y: 0, time: 0 }];

  time = 0;

  constructor(
    color: number,
    duration: number,
    timeBetween: number,
    areaWidth: number,
    areaHeight: number
  ) {
    this.color = color;
    this.speed = 0.2;
    this.duration = duration;
    this.timeBetween = timeBetween;
    this.areaWidth = areaWidth;
    this.areaHeight = areaHeight;
    this.areaX = 8;
    this.areaY = 4;
  }
}
