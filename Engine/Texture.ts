import State from '~~/Game/State';

class Texture {
  context: WebGL2RenderingContext;

  height: number = 0;

  loaded = false;

  texture: WebGLTexture;

  width: number = 0;

  constructor(source: string) {
    this.context = State.context;

    this.texture = this.context.createTexture() as WebGLTexture;
    this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
    this.context.texParameteri(
      this.context.TEXTURE_2D,
      this.context.TEXTURE_WRAP_S,
      this.context.CLAMP_TO_EDGE
    );
    this.context.texParameteri(
      this.context.TEXTURE_2D,
      this.context.TEXTURE_WRAP_T,
      this.context.CLAMP_TO_EDGE
    );
    this.context.texParameteri(
      this.context.TEXTURE_2D,
      this.context.TEXTURE_MAG_FILTER,
      this.context.NEAREST
    );
    this.context.texParameteri(
      this.context.TEXTURE_2D,
      this.context.TEXTURE_MIN_FILTER,
      this.context.NEAREST
    );

    const image = new Image();
    image.src = source;
    image.onload = () => {
      this.loaded = true;

      this.width = image.width;
      this.height = image.height;

      this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
      this.context.texImage2D(
        this.context.TEXTURE_2D,
        0,
        this.context.RGBA,
        this.context.RGBA,
        this.context.UNSIGNED_BYTE,
        image
      );
      this.context.generateMipmap(this.context.TEXTURE_2D);
    };
  }
}

export default Texture;
