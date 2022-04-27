class Terrain {
  position!: {
    x: number;
    y: number;
  };

  sprite!: {
    image: HTMLImageElement;
    source: string;
    x: number;
    y: number;
  };

  init(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;

    this.sprite.image.src = `/sprites/${this.sprite.source}.png`;
  }
}

export default Terrain;
