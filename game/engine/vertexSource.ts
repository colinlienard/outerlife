export default `#version 300 es
  layout(location=0) in vec4 position;
  layout(location=1) in vec2 textureCoord;
  layout(location=2) in float depth;
  layout(location=3) in mat4 modelMatrix;
  layout(location=7) in mat4 textureMatrix;

  out vec2 vTextureCoord;
  out float vDepth;

  void main() {
    gl_Position = modelMatrix * position;
    vTextureCoord = (textureMatrix * vec4(textureCoord, 0, 1)).xy;
    vDepth = depth;
  }
`;
