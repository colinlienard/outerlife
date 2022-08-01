import { mat4, vec3 } from 'gl-matrix';
import fragmentSource from './fragmentSource';
import Program from './program';
import vertexSource from './vertexSource';

export class Engine {
  gl: WebGL2RenderingContext;

  locations = {
    position: 0,
    textureCoord: 1,
    depth: 2,
    modelMatrix: 3,
    textureMatrix: 7,
  };

  program: WebGLProgram;

  renderData: number[] = [];

  renderQueueLenght = 0;

  sourcesIndex = <{ [key: string]: number }>{};

  MaxTextureSize = 0;

  translation = {
    x: 0,
    y: 0,
  };

  constructor(context: WebGL2RenderingContext) {
    this.gl = context;

    // Context settings
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    // Get a shader program
    this.program = new Program(this.gl, vertexSource, fragmentSource).get();
    this.gl.useProgram(this.program);

    // Bind all attribute locations in the vertex shader
    this.gl.bindAttribLocation(
      this.program,
      this.locations.position,
      'position'
    );
    this.gl.bindAttribLocation(
      this.program,
      this.locations.textureCoord,
      'textureCoord'
    );
    this.gl.bindAttribLocation(this.program, this.locations.depth, 'depth');
    this.gl.bindAttribLocation(
      this.program,
      this.locations.modelMatrix,
      'modelMatrix'
    );
    this.gl.bindAttribLocation(
      this.program,
      this.locations.textureMatrix,
      'textureMatrix'
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
      this.locations.position,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.locations.position);

    // Create texture coordinates
    const textureCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]),
      this.gl.STATIC_DRAW
    );
    this.gl.vertexAttribPointer(
      this.locations.textureCoord,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.locations.textureCoord);

    // Create the buffer that will be used by the following attributes
    const bufferData = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferData);

    // Bind the depth attribute
    this.gl.vertexAttribPointer(
      this.locations.depth,
      1,
      this.gl.FLOAT,
      false,
      33 * 4,
      0
    );
    this.gl.vertexAttribDivisor(this.locations.depth, 1);
    this.gl.enableVertexAttribArray(this.locations.depth);

    // Bind the model matrix attribute
    for (let index = 0; index < 4; index += 1) {
      const location = this.locations.modelMatrix + index;
      this.gl.vertexAttribPointer(
        location,
        4,
        this.gl.FLOAT,
        false,
        33 * 4,
        index * 16 + 4
      );
      this.gl.vertexAttribDivisor(location, 1);
      this.gl.enableVertexAttribArray(location);
    }

    // Bind the texture matrix attribute
    for (let index = 0; index < 4; index += 1) {
      const location = this.locations.textureMatrix + index;
      this.gl.vertexAttribPointer(
        location,
        4,
        this.gl.FLOAT,
        false,
        33 * 4,
        index * 16 + 4 * 16 + 4
      );
      this.gl.vertexAttribDivisor(location, 1);
      this.gl.enableVertexAttribArray(location);
    }
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
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
      // Set the texture unit to 0 for mobile
      this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'sampler'), 0);

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
      this.MaxTextureSize = Math.max(textureMaxWidth, textureMaxHeight);

      // Create a texture array with the max size
      this.gl.texStorage3D(
        this.gl.TEXTURE_2D_ARRAY,
        1,
        this.gl.RGBA8,
        this.MaxTextureSize,
        this.MaxTextureSize,
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
        this.sourcesIndex[sources[index]] = index;
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

  queueRender(
    source: string,
    sourceX: number,
    sourceY: number,
    sourceWidth: number,
    sourceHeight: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const textureUnit = this.sourcesIndex[source];

    if (textureUnit === undefined) {
      throw new Error(`The source '${source}' is not loaded.`);
    }

    const modelMatrix = mat4.create();
    mat4.ortho(modelMatrix, 0, window.innerWidth, window.innerHeight, 0, -1, 1);
    mat4.translate(
      modelMatrix,
      modelMatrix,
      vec3.fromValues(x + this.translation.x, y + this.translation.y, 0)
    );
    mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(width, height, 1));

    const textureMatrix = mat4.create();
    mat4.translate(
      textureMatrix,
      textureMatrix,
      vec3.fromValues(
        sourceX / this.MaxTextureSize,
        sourceY / this.MaxTextureSize,
        0
      )
    );
    mat4.scale(
      textureMatrix,
      textureMatrix,
      vec3.fromValues(
        sourceWidth / this.MaxTextureSize,
        sourceHeight / this.MaxTextureSize,
        1
      )
    );

    // Add all the data in the same array
    this.renderData.push(textureUnit, ...modelMatrix, ...textureMatrix);

    this.renderQueueLenght += 1;
  }

  render() {
    // Use the new data
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.renderData),
      this.gl.DYNAMIC_DRAW
    );

    // Render
    this.gl.drawArraysInstanced(
      this.gl.TRIANGLES,
      0,
      6,
      this.renderQueueLenght
    );

    // Reset the data for the next render
    this.renderData = [];
    this.renderQueueLenght = 0;
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
