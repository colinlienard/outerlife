import { glMatrix, mat4, vec3 } from 'gl-matrix';
import Program from './program';
import {
  glowFragmentShader,
  glowVertexShader,
  textureFragmentShader,
  textureVertexShader,
} from './shaders';

export class Engine {
  private readonly gl: WebGL2RenderingContext;

  private readonly textureProgram: WebGLProgram;

  private readonly glowProgram: WebGLProgram;

  private readonly textureVAO: WebGLVertexArrayObject;

  private readonly glowVAO: WebGLVertexArrayObject;

  private readonly textureBuffer: WebGLBuffer;

  private readonly glowBuffer: WebGLBuffer;

  private readonly textureLocations = {
    position: 0,
    textureCoord: 1,
    depth: 2,
    modelMatrix: 3,
    textureMatrix: 7,
    white: 11,
  };

  private readonly glowLocations = {
    position: 0,
    matrix: 1,
    size: 5,
    color: 6,
    opacity: 7,
  };

  private textureRenderData: number[] = [];

  private textureQueueLength = 0;

  private glowRenderData: number[] = [];

  private glowQueueLenght = 0;

  private textureSourcesIndex: Map<string, number> = new Map();

  private maxTextureSize = 0;

  private translation = { x: 0, y: 0 };

  constructor(canvas: HTMLCanvasElement) {
    const options: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    };
    this.gl = canvas.getContext('webgl2', options) as WebGL2RenderingContext;

    // Context settings
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.BLEND);

    // Create shader programs
    this.textureProgram = new Program(
      this.gl,
      textureVertexShader,
      textureFragmentShader
    ).get();
    this.glowProgram = new Program(
      this.gl,
      glowVertexShader,
      glowFragmentShader
    ).get();

    // Setup Vertex Array Objects
    this.textureVAO = this.gl.createVertexArray() as WebGLVertexArrayObject;
    this.glowVAO = this.gl.createVertexArray() as WebGLVertexArrayObject;

    // Setup buffers
    this.textureBuffer = this.gl.createBuffer() as WebGLBuffer;
    this.glowBuffer = this.gl.createBuffer() as WebGLBuffer;

    // Setup programs
    this.setupTextureProgram();
    this.setupGlowProgram();
  }

  setupTextureProgram() {
    this.gl.bindVertexArray(this.textureVAO);

    // Set the texture unit to 0 for mobile
    this.gl.useProgram(this.textureProgram);
    this.gl.uniform1i(
      this.gl.getUniformLocation(this.textureProgram, 'uSampler'),
      0
    );

    // Create a position for the vertices
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]),
      this.gl.STATIC_DRAW
    );
    this.gl.vertexAttribPointer(
      this.textureLocations.position,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.textureLocations.position);

    // Create texture coordinates
    const textureCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]),
      this.gl.STATIC_DRAW
    );
    this.gl.vertexAttribPointer(
      this.textureLocations.textureCoord,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.textureLocations.textureCoord);

    // Bind the buffer that will be used by the following attributes
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
    const stride = (1 + 16 + 16 + 1) * 4;

    // Bind the depth attribute
    this.gl.vertexAttribPointer(
      this.textureLocations.depth,
      1,
      this.gl.FLOAT,
      false,
      stride,
      0
    );
    this.gl.vertexAttribDivisor(this.textureLocations.depth, 1);
    this.gl.enableVertexAttribArray(this.textureLocations.depth);

    // Bind the model matrix attribute
    for (let index = 0; index < 4; index += 1) {
      const location = this.textureLocations.modelMatrix + index;
      this.gl.vertexAttribPointer(
        location,
        4,
        this.gl.FLOAT,
        false,
        stride,
        index * 16 + 4
      );
      this.gl.vertexAttribDivisor(location, 1);
      this.gl.enableVertexAttribArray(location);
    }

    // Bind the texture matrix attribute
    for (let index = 0; index < 4; index += 1) {
      const location = this.textureLocations.textureMatrix + index;
      this.gl.vertexAttribPointer(
        location,
        4,
        this.gl.FLOAT,
        false,
        stride,
        index * 16 + 4 * 16 + 4
      );
      this.gl.vertexAttribDivisor(location, 1);
      this.gl.enableVertexAttribArray(location);
    }

    // Bind the white attribute
    this.gl.vertexAttribPointer(
      this.textureLocations.white,
      1,
      this.gl.FLOAT,
      false,
      stride,
      4 * 16 + 4 * 16 + 4
    );
    this.gl.vertexAttribDivisor(this.textureLocations.white, 1);
    this.gl.enableVertexAttribArray(this.textureLocations.white);

    this.gl.bindVertexArray(null);
  }

  setupGlowProgram() {
    this.gl.bindVertexArray(this.glowVAO);

    // Create a position for the vertices
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]),
      this.gl.STATIC_DRAW
    );
    this.gl.vertexAttribPointer(
      this.glowLocations.position,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.glowLocations.position);

    // Bind the buffer that will be used by the following attributes
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glowBuffer);
    const stride = (16 + 3 + 3 + 1) * 4;

    // Bind the matrix attribute
    for (let index = 0; index < 4; index += 1) {
      const location = this.glowLocations.matrix + index;
      this.gl.vertexAttribPointer(
        location,
        4,
        this.gl.FLOAT,
        false,
        stride,
        index * 16
      );
      this.gl.vertexAttribDivisor(location, 1);
      this.gl.enableVertexAttribArray(location);
    }

    // Bind the size attribute
    this.gl.vertexAttribPointer(
      this.glowLocations.size,
      3,
      this.gl.FLOAT,
      false,
      stride,
      16 * 4
    );
    this.gl.vertexAttribDivisor(this.glowLocations.size, 1);
    this.gl.enableVertexAttribArray(this.glowLocations.size);

    // Bind the color attribute
    this.gl.vertexAttribPointer(
      this.glowLocations.color,
      3,
      this.gl.FLOAT,
      false,
      stride,
      (16 + 3) * 4
    );
    this.gl.vertexAttribDivisor(this.glowLocations.color, 1);
    this.gl.enableVertexAttribArray(this.glowLocations.color);

    // Bind the opacity attribute
    this.gl.vertexAttribPointer(
      this.glowLocations.opacity,
      1,
      this.gl.FLOAT,
      false,
      stride,
      (16 + 3 + 3) * 4
    );
    this.gl.vertexAttribDivisor(this.glowLocations.opacity, 1);
    this.gl.enableVertexAttribArray(this.glowLocations.opacity);

    this.gl.bindVertexArray(null);
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  flush() {
    this.gl.flush();
  }

  // eslint-disable-next-line class-methods-use-this
  loadImage(source: string) {
    return new Promise((resolve: (image: HTMLImageElement) => void) => {
      const image = new Image();
      image.src = source;
      image.onload = () => {
        resolve(image);
      };
      image.onerror = () => {
        throw new Error(`Image with a source of '${source}' cannot be loaded.`);
      };
    });
  }

  loadTextures(sources: string[]) {
    return new Promise<void>(async (resolve) => {
      // Create and bind texture
      const texture = this.gl.createTexture() as WebGLTexture;
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, texture);

      // Load images
      const promises = sources.map((source) => this.loadImage(source));
      const images = await Promise.all(promises);

      // Get the max size of all the images
      const textureMaxWidth = images.reduce(
        (previous, current) => Math.max(previous, current.width),
        0
      );
      const textureMaxHeight = images.reduce(
        (previous, current) => Math.max(previous, current.height),
        0
      );
      this.maxTextureSize = Math.max(textureMaxWidth, textureMaxHeight);

      // Create a texture array with the max size
      this.gl.texStorage3D(
        this.gl.TEXTURE_2D_ARRAY,
        1,
        this.gl.RGBA8,
        this.maxTextureSize,
        this.maxTextureSize,
        sources.length
      );

      // Add each image in the texture array
      for (let index = 0; index < sources.length; index += 1) {
        const image = images[index];
        this.gl.texSubImage3D(
          this.gl.TEXTURE_2D_ARRAY,
          0,
          0,
          0,
          index,
          image.width,
          image.height,
          1,
          this.gl.RGBA,
          this.gl.UNSIGNED_BYTE,
          image
        );

        // Save the depth of each source in the array
        this.textureSourcesIndex.set(sources[index], index);
      }

      // Texture settings
      this.gl.texParameteri(
        this.gl.TEXTURE_2D_ARRAY,
        this.gl.TEXTURE_WRAP_S,
        this.gl.CLAMP_TO_EDGE
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D_ARRAY,
        this.gl.TEXTURE_WRAP_T,
        this.gl.CLAMP_TO_EDGE
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D_ARRAY,
        this.gl.TEXTURE_MAG_FILTER,
        this.gl.NEAREST
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D_ARRAY,
        this.gl.TEXTURE_MIN_FILTER,
        this.gl.NEAREST
      );

      resolve();
    });
  }

  queueTextureRender(
    source: string,
    sourceX: number,
    sourceY: number,
    sourceWidth: number,
    sourceHeight: number,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation = 0,
    white = false
  ) {
    // Texture source
    const textureUnit = this.textureSourcesIndex.get(source);
    if (textureUnit === undefined) {
      throw new Error(`The source '${source}' is not loaded.`);
    }

    // Model matrix
    const modelMatrix = mat4.create();
    mat4.ortho(modelMatrix, 0, window.innerWidth, window.innerHeight, 0, -1, 1);
    mat4.translate(
      modelMatrix,
      modelMatrix,
      vec3.fromValues(x + this.translation.x, y + this.translation.y, 0)
    );
    if (rotation) {
      mat4.translate(
        modelMatrix,
        modelMatrix,
        vec3.fromValues(width / 2, height / 2, 0)
      );
      mat4.rotateZ(modelMatrix, modelMatrix, glMatrix.toRadian(rotation));
      mat4.translate(
        modelMatrix,
        modelMatrix,
        vec3.fromValues(width / -2, height / -2, 0)
      );
    }
    mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(width, height, 1));

    // Texture matrix
    const textureMatrix = mat4.create();
    mat4.translate(
      textureMatrix,
      textureMatrix,
      vec3.fromValues(
        sourceX / this.maxTextureSize,
        sourceY / this.maxTextureSize,
        0
      )
    );
    mat4.scale(
      textureMatrix,
      textureMatrix,
      vec3.fromValues(
        sourceWidth / this.maxTextureSize,
        sourceHeight / this.maxTextureSize,
        1
      )
    );

    // Add all the data in the same array
    this.textureRenderData.push(
      textureUnit,
      ...modelMatrix,
      ...textureMatrix,
      white ? 1 : 0
    );

    this.textureQueueLength += 1;
  }

  queueGlowRender(
    color: [number, number, number],
    opacity: number,
    x: number,
    y: number,
    size: number
  ) {
    // Matrix
    const matrix = mat4.create();
    mat4.ortho(matrix, 0, window.innerWidth, window.innerHeight, 0, -1, 1);
    mat4.translate(
      matrix,
      matrix,
      vec3.fromValues(x + this.translation.x, y + this.translation.y, 0)
    );
    mat4.scale(matrix, matrix, vec3.fromValues(size, size, 1));

    // Size
    const sizes = [
      size / 2 + x + this.translation.x,
      size / 2 + window.innerHeight - size - y - this.translation.y,
      size,
    ];

    // Add all the data in the same array
    this.glowRenderData.push(...matrix, ...sizes, ...color, opacity);

    this.glowQueueLenght += 1;
  }

  render() {
    // Use texture setup
    this.gl.useProgram(this.textureProgram);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.bindVertexArray(this.textureVAO);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);

    // Use the new data
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.textureRenderData),
      this.gl.DYNAMIC_DRAW
    );

    // Render
    this.gl.drawArraysInstanced(
      this.gl.TRIANGLES,
      0,
      6,
      this.textureQueueLength
    );

    // Use glow setup
    this.gl.useProgram(this.glowProgram);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
    this.gl.bindVertexArray(this.glowVAO);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glowBuffer);

    // Use the new data
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.glowRenderData),
      this.gl.DYNAMIC_DRAW
    );

    // Render
    this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, 6, this.glowQueueLenght);

    // Reset the data for the next render
    this.textureRenderData = [];
    this.textureQueueLength = 0;
    this.glowRenderData = [];
    this.glowQueueLenght = 0;
  }

  resize() {
    const { canvas } = this.gl;
    const { width, height } = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    this.gl.viewport(0, 0, canvas.width, canvas.height);
  }

  translate(x: number, y: number) {
    this.translation.x = x;
    this.translation.y = y;
  }
}
