import { Component, Horizontal, Vertical } from '~~/game/utils';

export class Input implements Component {
  attack = {
    doing: false,
    direction: <Horizontal | Vertical>'down',
  };

  dash = {
    doing: false,
    direction: <Horizontal | Vertical>'down',
  };

  movements = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
}
