precision mediump float;

attribute vec3 position;
attribute float posInRay;

uniform float t;
uniform float dt;

void main() {
  vec3 pos = vec3(position.xy, position.z - t - dt * posInRay);
  gl_Position = vec4(pos, pos.z * 2.0);
  // gl_PointSize = 1.0 / pos.z;
}
