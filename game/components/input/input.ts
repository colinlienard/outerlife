import { Component, Horizontal, Vertical } from '~~/game/utils';

export class Input implements Component {
  attack = {
    doing: false,
    direction: <Horizontal | Vertical>'down',
  };

  dash = {
    doing: false,
    direction: <Horizontal | Vertical>'down',
    target: {
      x: 0,
      y: 0,
    },
  };

  movements = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
}
