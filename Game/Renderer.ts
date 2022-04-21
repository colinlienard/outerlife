class Renderer {
  context: CanvasRenderingContext2D | null;

  ratio = 1;

  constructor(canvas: HTMLCanvasElement, yPixelsNumber: number) {
    this.context = canvas.getContext('2d');
    if (this.context) {
      this.context.imageSmoothingEnabled = false;

      this.ratio = Math.round(window.innerHeight / yPixelsNumber);

      window.requestAnimationFrame(() => this.render());
    }
  }

  render() {
    if (this.context) {
      const image = new Image();
      image.src = 'assets/sprites/player.png';

      const spriteSize = 32;
      this.context.drawImage(
        image,
        0,
        0,
        spriteSize,
        spriteSize,
        0,
        0,
        spriteSize * this.ratio,
        spriteSize * this.ratio
      );
    }
    window.requestAnimationFrame(() => this.render());
  }

  updateSize(yPixelsNumber: number) {
    this.ratio = Math.round(window.innerHeight / yPixelsNumber);
    if (this.context) {
      this.context.imageSmoothingEnabled = false;
    }
  }
}

export default Renderer;
