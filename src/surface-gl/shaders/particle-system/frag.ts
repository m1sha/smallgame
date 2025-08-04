export default /*glsl*/`
  uniform sampler2D uSampler;
  uniform vec2 iResolution;
  uniform float uGlobalAlpha;
  in  vec2 v_TexCoord;
  out vec4 fragColor;

  void main() {
    fragColor = texture(uSampler, v_TexCoord);
    if (fragColor.a > 0.001) fragColor.a = uGlobalAlpha;
  }
`