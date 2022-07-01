import { mat4, vec3 } from 'gl-matrix';
import State from '~~/Game/State';
import Program from './Program';
import Texture from './Texture';

const vertexSource = `#version 300 es
  in vec4 a_position;
  in vec2 a_texCoord;

  uniform mat4 u_matrix;
  uniform mat4 u_textureMatrix;

  out vec2 v_texCoord;

  void main() {
    gl_Position = u_matrix * a_position;
    v_texCoord = (u_textureMatrix * vec4(a_texCoord, 0, 1)).xy;
  }
`;

const fragmentSource = `#version 300 es
  precision highp float;

  in vec2 v_texCoord;

  uniform sampler2D u_texture;

  out vec4 outColor;

  void main() {
    outColor = texture(u_texture, v_texCoord);
  }
`;

class Engine {
  context: WebGL2RenderingContext;

  program: WebGLProgram;

  locations!: {
    matrixLocation: WebGLUniformLocation;
    textureLocation: WebGLUniformLocation;
    textureMatrixLocation: WebGLUniformLocation;
  };

  vertexArray: WebGLVertexArrayObject;

  constructor() {
    this.context = State.context;
    this.context.clearColor(0, 0, 0, 1);
    this.context.enable(this.context.BLEND);
    this.context.blendFunc(
      this.context.SRC_ALPHA,
      this.context.ONE_MINUS_SRC_ALPHA
    );
    this.context.colorMask(true, true, true, false);

    this.program = new Program(vertexSource, fragmentSource).get();

    this.vertexArray =
      this.context.createVertexArray() as WebGLVertexArrayObject;
    this.context.bindVertexArray(this.vertexArray);

    const positionLocation = this.getAttributeLocation('a_position');
    this.bindAttributeLocation(
      [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1],
      positionLocation
    );

    const texCoordLocation = this.getAttributeLocation('a_texCoord');
    this.bindAttributeLocation(
      [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1],
      texCoordLocation
    );

    const matrixLocation = this.getUniformLocation('u_matrix');
    const textureLocation = this.getUniformLocation('u_texture');
    const textureMatrixLocation = this.getUniformLocation('u_textureMatrix');

    this.locations = {
      matrixLocation,
      textureLocation,
      textureMatrixLocation,
    };
  }

  bindAttributeLocation(rect: number[], location: number) {
    const buffer = this.context.createBuffer();
    this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer);
    this.context.bufferData(
      this.context.ARRAY_BUFFER,
      new Float32Array(rect),
      this.context.STATIC_DRAW
    );
    this.context.enableVertexAttribArray(location);
    this.context.vertexAttribPointer(
      location,
      2,
      this.context.FLOAT,
      false,
      0,
      0
    );
  }

  clear() {
    this.context.clear(this.context.COLOR_BUFFER_BIT);
  }

  getAttributeLocation(name: string) {
    return this.context.getAttribLocation(this.program, name);
  }

  getUniformLocation(name: string) {
    return this.context.getUniformLocation(
      this.program,
      name
    ) as WebGLUniformLocation;
  }

  renderTexture(
    texture: Texture | null,
    sourceX: number,
    sourceY: number,
    sourceWidth: number,
    sourceHeight: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    if (!texture || !texture.loaded) {
      return;
    }

    this.context.useProgram(this.program);

    this.context.bindVertexArray(this.vertexArray);

    const textureUnit = 0;
    this.context.uniform1i(this.locations.textureLocation, textureUnit);
    this.context.activeTexture(this.context.TEXTURE0 + textureUnit);
    this.context.bindTexture(this.context.TEXTURE_2D, texture.texture);

    const matrix = mat4.create();
    mat4.ortho(
      matrix,
      0,
      this.context.canvas.clientWidth,
      this.context.canvas.clientHeight,
      0,
      -1,
      1
    );
    mat4.translate(matrix, matrix, vec3.fromValues(x, y, 0));
    mat4.scale(matrix, matrix, vec3.fromValues(width, height, 1));
    this.context.uniformMatrix4fv(this.locations.matrixLocation, false, matrix);

    const textureMatrix = mat4.create();
    mat4.translate(
      textureMatrix,
      textureMatrix,
      vec3.fromValues(sourceX / texture.width, sourceY / texture.height, 0)
    );
    mat4.scale(
      textureMatrix,
      textureMatrix,
      vec3.fromValues(
        sourceWidth / texture.width,
        sourceHeight / texture.height,
        1
      )
    );
    this.context.uniformMatrix4fv(
      this.locations.textureMatrixLocation,
      false,
      textureMatrix
    );

    this.context.drawArrays(this.context.TRIANGLES, 0, 6);
  }

  resize() {
    const { canvas } = this.context;
    const { width, height } = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    this.context.viewport(0, 0, canvas.width, canvas.height);
  }
}

export default Engine;
