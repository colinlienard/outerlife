class Renderer {
  context: CanvasRenderingContext2D | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d');
    if (this.context) {
      this.context.imageSmoothingEnabled = false;

      const image = new Image();
      image.src = '../../../assets/sprites/player.png';

      image.addEventListener('load', () => {
        this.context?.drawImage(image, 0, 0, 32, 32, 0, 0, 200, 200);
      });
    }
  }
}

export default Renderer;
