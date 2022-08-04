import { Component } from '~~/game/utils';

export class Input implements Component {
  movements = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  attack = {
    attacking: false,
  };
}
