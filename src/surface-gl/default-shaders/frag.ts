export default /*glsl*/`
  uniform sampler2D uSampler;
  uniform vec2 iResolution;
  in  vec2 v_TexCoord;
  out vec4 fragColor;

  void main() {
    fragColor = texture(uSampler, v_TexCoord);
  }
`