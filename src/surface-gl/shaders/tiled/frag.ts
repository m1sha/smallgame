export default /*glsl*/`
  uniform sampler2D uSampler;
  uniform mat4 uTexTransform;
  uniform vec2 iResolution;
  uniform float uGlobalAlpha;
  out vec4 fragColor;

  void main() {
    vec2 pos = (uTexTransform * vec4(gl_PointCoord, 0.0, 1.0)).xy;
    fragColor =  texture(uSampler, pos);
    if (fragColor.a > 0.001) fragColor.a = uGlobalAlpha;
  }
`