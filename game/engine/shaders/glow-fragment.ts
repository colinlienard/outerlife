export const glowFragmentShader = `#version 300 es
precision mediump float;

in vec3 vSize;
in vec3 vColor;
in float vOpacity;
in float vRadialGradient;

out vec4 fragColor;

void main() {
  if (vRadialGradient == 1.) {
    float dist = distance(gl_FragCoord.xy, vSize.xy) / (vSize.z / 2.);
    fragColor = mix(vec4(vColor, vOpacity), vec4(vColor, 0.), dist);
  } else {
    fragColor = vec4(vColor, vOpacity);
  }
}`;
