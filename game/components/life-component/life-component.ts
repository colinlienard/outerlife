import { Component } from '~~/game/utils';

export class LifeComponent implements Component {
  readonly max: number;

  current: number;

  constructor(max: number) {
    this.max = max;
    this.current = max;
  }
}
