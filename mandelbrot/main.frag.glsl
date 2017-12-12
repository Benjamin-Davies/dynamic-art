precision mediump float;

const int MAX_I = 50;

varying vec2 fragPosition;

uniform mat3 matrix;

vec2 cmpSq(vec2 z) {
  return vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y);
}

void main() {
  vec2 z = vec2(0.0, 0.0);
  vec2 c = (matrix * vec3(fragPosition, 1.0)).xy;
  float x = 0.0;

  for (int i = 0; i < MAX_I; i++) {
    if (dot(z, z) < 4.0) {
      x++;
      z = cmpSq(z) + c;
    }
  }

  float s = x / float(MAX_I);
  gl_FragColor = vec4(s, s, s, 1.0);
}
