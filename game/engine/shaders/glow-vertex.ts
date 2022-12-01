export const glowVertexShader = `#version 300 es
layout(location=0) in vec4 aPosition;
layout(location=1) in mat4 aMatrix;
layout(location=5) in vec3 aSize;
layout(location=6) in vec3 aColor;
layout(location=7) in float aOpacity;

out vec3 vSize;
out vec3 vColor;
out float vOpacity;

void main() {
  vSize = aSize;
  vColor = aColor;
  vOpacity = aOpacity;

  gl_Position = aMatrix * aPosition;
}
`;
