export default `#version 300 es
  precision mediump float;
  precision mediump sampler2DArray;

  uniform sampler2DArray sampler;

  in vec2 vTextureCoord;
  in float vDepth;
  in float vWhite;

  out vec4 fragColor;

  void main() {
    vec4 texel = texture(sampler, vec3(vTextureCoord, vDepth));
    vec3 color = texel.rgb;

    if(vWhite == 1.0) {
      color = vec3(1, 1, 1);
    }

    fragColor = vec4(color, texel.a);
  }
`;
