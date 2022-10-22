import { Component } from '~~/game/utils';

export class HealthComponent implements Component {
  readonly parentId: number;

  readonly max: number;

  current: number;

  constructor(parentId: number, max: number) {
    this.parentId = parentId;
    this.max = max;
    this.current = max;
  }

  damage(damages: number) {
    this.current -= damages;

    return this.current <= 0;
  }
}
