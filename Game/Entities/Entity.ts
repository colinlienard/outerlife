import { Animation, Direction, EntityLayer } from '../types';

class Entity {
  animations!: { [key: string]: Animation };

  position!: {
    x: number;
    y: number;
    direction?: Direction;
    speed?: number;
    maxSpeed?: number;
    acceleration?: number;
    deceleration?: number;
  };

  sprite!: {
    image: HTMLImageElement;
    source: string;
    width: number;
    height: number;

    currentAnimation: Animation;
    row: number;
    column: number;
    frameWaiter: number;

    behind?: EntityLayer;
    over?: EntityLayer;
  };
}

export default Entity;
