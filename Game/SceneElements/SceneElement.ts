import { Animation, Direction, SceneLayerElement } from '../types';

class SceneElement {
  animations!: { [key: string]: Animation };

  position!: {
    x: number;
    y: number;
    direction: Direction;
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

    behind?: SceneLayerElement;
    over?: SceneLayerElement;
  };
}

export default SceneElement;
