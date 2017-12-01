precision mediump float;

const int MAX_BALLS = mb;

varying vec2 fragPosition;

uniform float intensity;
uniform vec2 balls[MAX_BALLS];

void main() {
  float total = 0.0;
  for (int i = 0; i < MAX_BALLS; i++) {
    total += intensity / length(fragPosition - balls[i]);
  }

  gl_FragColor = vec4(total, total, total, 1.0);
}
