class Terrain {
  position = {
    x: 0,
    y: 0,
  };

  sprite = {
    image: new Image(),
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

    this.sprite.image.src = `/sprites/${source}.png`;
    this.sprite.x = spriteX;
    this.sprite.y = spriteY;
  }
}

export default Terrain;
