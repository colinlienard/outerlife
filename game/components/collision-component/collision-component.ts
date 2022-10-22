import { Component } from '~~/game/utils';
import { Collision } from './types';

export class CollisionComponent implements Component {
  readonly collisions: Collision[];

  constructor(collisions: Collision[]) {
    this.collisions = collisions;
  }
}
