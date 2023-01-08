import { Direction } from '~~/game/utils';

export type PlayerInput = {
  angle: number;
  running: boolean;
  interact: boolean;
};

export type Keyboard = Record<Direction, boolean>;
