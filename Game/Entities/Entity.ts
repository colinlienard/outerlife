import Texture from '~~/Engine/Texture';
import { TILE_SIZE } from '../globals';
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
    source: string;
    width: number;
    height: number;

    sourceX?: number;
    sourceY?: number;

    shadow?: EntityLayer;
  };

  texture?: Texture;

  init(x: number, y: number) {
    this.position.x = x - this.sprite.width / 2 + TILE_SIZE / 2;
    this.position.y = y - this.sprite.height + TILE_SIZE / 2;

    this.texture = new Texture(
      `/sprites/${this.sprite.source}.png`,
      this.sprite.width,
      this.sprite.height
    );
  }
}

export default Entity;
