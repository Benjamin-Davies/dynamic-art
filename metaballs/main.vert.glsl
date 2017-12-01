precision mediump float;

attribute vec2 position;

varying vec2 fragPosition;

void main() {
  fragPosition = position;
  gl_Position = vec4(position, 0.0, 1.0);
}
