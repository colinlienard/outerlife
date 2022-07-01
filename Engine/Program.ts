import State from '~~/Game/State';

class Material {
  context: WebGL2RenderingContext;

  program: WebGLProgram;

  constructor(vertexSource: string, fragmentSource: string) {
    this.context = State.context;

    const vertexShader = this.createShader(vertexSource, 'vertex');
    const fragmentShader = this.createShader(fragmentSource, 'fragment');

    this.program = this.context.createProgram() as WebGLProgram;
    this.context.attachShader(this.program, vertexShader);
    this.context.attachShader(this.program, fragmentShader);
    this.context.linkProgram(this.program);

    this.context.detachShader(this.program, vertexShader);
    this.context.detachShader(this.program, fragmentShader);
    this.context.deleteShader(vertexShader);
    this.context.deleteShader(fragmentShader);
  }

  createShader(source: string, type: 'vertex' | 'fragment') {
    const shader = this.context.createShader(
      type === 'vertex'
        ? this.context.VERTEX_SHADER
        : this.context.FRAGMENT_SHADER
    ) as WebGLShader;
    this.context.shaderSource(shader, source);
    this.context.compileShader(shader);

    if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
      throw new Error(
        `Shader error: \n${this.context.getShaderInfoLog(shader)}`
      );
    }

    return shader;
  }

  get() {
    return this.program;
  }
}

export default Material;
