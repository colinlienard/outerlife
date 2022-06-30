import { mat3, vec2 } from 'gl-matrix';
import State from '~~/Game/State';
import Material from './Material';
import WorldMatrix from './WorldMatrix';

const vertexSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  uniform mat3 u_world;
  uniform mat3 u_object;
  uniform vec2 u_frame;  
  varying vec2 v_texCoord;

  void main(){
    gl_Position = vec4(u_world * u_object * vec3(a_position, 1), 1);
    v_texCoord = a_texCoord + u_frame;
  }
`;

const fragmentSource = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  
  void main(){
    gl_FragColor = texture2D(u_image, v_texCoord);
  }
`;

class Texture {
  context: WebGL2RenderingContext;

  image!: HTMLImageElement;

  loaded = false;

  parameters!: {
    textureBuffer: WebGLBuffer;
    geoBuffer: WebGLBuffer;
    positionLocation: number;
    textureCoordLocation: number;
    imageLocation: WebGLUniformLocation;
    worldLocation: WebGLUniformLocation;
    frameLocation: WebGLUniformLocation;
    objectLocation: WebGLUniformLocation;
  };

  program: WebGLProgram;

  texture!: WebGLTexture;

  constructor(source: string, width: number, height: number) {
    this.context = State.context;

    this.program = new Material(vertexSource, fragmentSource).getProgram();

    (async () => {
      await this.loadImage(source);

      this.loaded = true;

      this.createTexture();

      this.setParameters(width, height);
    })();
  }

  loadImage(source: string) {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = source;
      image.onload = resolve;

      this.image = image;
    });
  }

  createRectBuffer(x = 0, y = 0, width = 1, height = 1) {
    const rect = new Float32Array([
      x,
      y,
      x + width,
      y,
      x,
      y + height,
      x,
      y + height,
      x + width,
      y,
      x + width,
      y + height,
    ]);

    const buffer = this.context.createBuffer() as WebGLBuffer;
    this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer);
    this.context.bufferData(
      this.context.ARRAY_BUFFER,
      rect,
      this.context.STATIC_DRAW
    );

    return buffer;
  }

  createTexture() {
    this.texture = this.context.createTexture() as WebGLTexture;

    this.context.useProgram(this.program);

    this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
    this.context.texParameteri(
      this.context.TEXTURE_2D,
      this.context.TEXTURE_WRAP_S,
      this.context.MIRRORED_REPEAT
    );
    this.context.texParameteri(
      this.context.TEXTURE_2D,
      this.context.TEXTURE_WRAP_T,
      this.context.MIRRORED_REPEAT
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
    this.context.texImage2D(
      this.context.TEXTURE_2D,
      0,
      this.context.RGBA,
      this.context.RGBA,
      this.context.UNSIGNED_BYTE,
      this.image
    );
    this.context.bindTexture(this.context.TEXTURE_2D, null);
  }

  getAttribLocation(name: string) {
    return this.context.getAttribLocation(this.program, name);
  }

  getUniformLocation(name: string) {
    return this.context.getUniformLocation(
      this.program,
      name
    ) as WebGLUniformLocation;
  }

  setParameters(width: number, height: number) {
    const frameWidth = width / this.image.width;
    const frameHeight = height / this.image.height;

    this.parameters = {
      textureBuffer: this.createRectBuffer(0, 0, frameWidth, frameHeight),
      geoBuffer: this.createRectBuffer(0, 0, width, height),
      positionLocation: this.getAttribLocation('a_position'),
      textureCoordLocation: this.getAttribLocation('a_texCoord'),
      imageLocation: this.getUniformLocation('u_image'),
      worldLocation: this.getUniformLocation('u_world'),
      frameLocation: this.getUniformLocation('u_frame'),
      objectLocation: this.getUniformLocation('u_object'),
    };

    this.context.useProgram(null);
  }

  render(x: number, y: number, sourceX: number, sourceY: number) {
    if (!this.loaded) {
      return;
    }

    this.context.useProgram(this.program);

    const objectMatrix = mat3.create();
    mat3.translate(objectMatrix, objectMatrix, vec2.fromValues(x, y));

    this.context.activeTexture(this.context.TEXTURE0);
    this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
    this.context.uniform1i(this.parameters.imageLocation, 0);

    this.context.bindBuffer(
      this.context.ARRAY_BUFFER,
      this.parameters.textureBuffer
    );
    this.context.enableVertexAttribArray(this.parameters.textureCoordLocation);
    this.context.vertexAttribPointer(
      this.parameters.textureCoordLocation,
      2,
      this.context.FLOAT,
      false,
      0,
      0
    );

    this.context.bindBuffer(
      this.context.ARRAY_BUFFER,
      this.parameters.geoBuffer
    );
    this.context.enableVertexAttribArray(this.parameters.positionLocation);
    this.context.vertexAttribPointer(
      this.parameters.positionLocation,
      2,
      this.context.FLOAT,
      false,
      0,
      0
    );

    this.context.uniformMatrix3fv(
      this.parameters.worldLocation,
      false,
      WorldMatrix.get()
    );
    this.context.uniform2f(
      this.parameters.frameLocation,
      sourceX / this.image.width,
      sourceY / this.image.height
    );
    this.context.uniformMatrix3fv(
      this.parameters.objectLocation,
      false,
      objectMatrix
    );

    this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, 6);

    this.context.useProgram(null);

    this.context.flush();
  }
}

export default Texture;
