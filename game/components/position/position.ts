import { Component } from '~~/game/utils';

export class Position implements Component {
  x: number;

  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  changeX(number: number) {
    this.x += number;
  }

  changeY(number: number) {
    this.y += number;
  }
}
