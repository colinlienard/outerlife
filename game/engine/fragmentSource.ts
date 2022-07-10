export default `#version 300 es
  precision mediump float;
  precision mediump sampler2DArray;

  uniform sampler2DArray sampler;

  in vec2 vTextureCoord;
  in float vDepth;

  out vec4 fragColor;

  void main() {
    fragColor = texture(sampler, vec3(vTextureCoord, vDepth));
  }
`;
