export default /*glsl*/`
  uniform mat4 uMatrix;
  uniform mat4 uTexTransform;
  in  vec2 a_Position;
  in  vec2 a_TexCoord;
  in  vec2 a_TileSize;
  out vec2 v_TexCoord;
  out vec2 v_TileSize;

  void main()
  {
    gl_Position = uMatrix * vec4(a_Position, 0.0, 1.0);
    v_TexCoord = (uTexTransform * vec4(a_TexCoord, 0.0, 1.0)).xy;
    v_TileSize = a_TileSize;
  }
`