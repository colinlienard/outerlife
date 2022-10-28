class Program {
  readonly gl: WebGL2RenderingContext;

  readonly program: WebGLProgram;

  constructor(
    context: WebGL2RenderingContext,
    vertexSource: string,
    fragmentSource: string
  ) {
    this.gl = context;

    const vertexShader = this.createShader(vertexSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.createShader(
      fragmentSource,
      this.gl.FRAGMENT_SHADER
    );

    this.program = this.gl.createProgram() as WebGLProgram;
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    this.gl.detachShader(this.program, vertexShader);
    this.gl.detachShader(this.program, fragmentShader);
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);
  }

  createShader(source: string, type: number) {
    const shader = this.gl.createShader(type) as WebGLShader;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(`Shader error: \n${this.gl.getShaderInfoLog(shader)}`);
    }

    return shader;
  }

  get() {
    return this.program;
  }
}

export default Program;
