import { Component, Horizontal, Vertical } from '~~/game/utils';

const defaultMovements = {
  up: false,
  down: false,
  left: false,
  right: false,
};

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

  movements = { ...defaultMovements };

  resetMovements() {
    this.movements = { ...defaultMovements };
  }
}
