import { Animation, Collider, Direction, EntityLayer } from '../types';

class Entity {
  animations?: { [key: string]: Animation };

  animator?: {
    currentAnimation: Animation;
    row: number;
    column: number;
    frameWaiter: number;
  };

  collider!: Collider;

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

    sourceX?: number;
    sourceY?: number;

    shadow?: EntityLayer;
  };

  init(x: number, y: number) {
    this.position.x = x - this.sprite.width / 2 + 8;
    this.position.y = y - this.sprite.height + 8;

    this.sprite.image.src = `/sprites/${this.sprite.source}.png`;
  }
}

export default Entity;
