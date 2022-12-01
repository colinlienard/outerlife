export const textureVertexShader = `#version 300 es
layout(location=0) in vec4 aPosition;
layout(location=1) in vec2 aTextureCoord;
layout(location=2) in float aDepth;
layout(location=3) in mat4 aModelMatrix;
layout(location=7) in mat4 aTextureMatrix;
layout(location=11) in float aWhite;

out vec2 vTextureCoord;
out float vDepth;
out float vWhite;

void main() {
  vTextureCoord = (aTextureMatrix * vec4(aTextureCoord, 0, 1)).xy;
  vDepth = aDepth;
  vWhite = aWhite;

  gl_Position = aModelMatrix * aPosition;
}
`;
