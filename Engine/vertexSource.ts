export default `#version 300 es
  in vec4 position;
  in vec2 textureCoord;
  in float depth;
  in mat4 modelMatrix;
  in mat4 textureMatrix;

  out vec2 vTextureCoord;
  out float vDepth;

  void main() {
    gl_Position = modelMatrix * position;
    vTextureCoord = (textureMatrix * vec4(textureCoord, 0, 1)).xy;
    vDepth = depth;
  }
`;
