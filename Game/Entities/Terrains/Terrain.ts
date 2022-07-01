import Texture from '~~/Engine/Texture';

class Terrain {
  position = {
    x: 0,
    y: 0,
  };

  sprite = {
    texture: <Texture | null>null,
    x: 0,
    y: 0,
  };

  constructor(
    x: number,
    y: number,
    source: string,
    spriteX: number,
    spriteY: number
  ) {
    this.position.x = x;
    this.position.y = y;

    this.sprite.x = spriteX;
    this.sprite.y = spriteY;

    this.sprite.texture = new Texture(`/sprites/${source}.png`);
  }
}

export default Terrain;
