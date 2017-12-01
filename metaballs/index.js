import Ball from './ball.js';

const maxBalls = 10;

export default async () => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const gl =
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) throw new Error('Could not create rendering context');

  document.body.style.backgroundColor = 'black';
  document.body.style.overflow = 'hidden';
  document.body.style.padding = 0;
  document.body.style.margin = 0;
  let w = 0,
    h = 0;

  const [vertShaderSrc, fragShaderSrc] = await Promise.all([
    fetch('./main.vert.glsl').then(r => r.text()),
    fetch('./main.frag.glsl')
      .then(r => r.text())
      .then(s => s.replace('mb', maxBalls.toFixed()))
  ]);

  // Shaders
  const vertShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertShader, vertShaderSrc);
  gl.compileShader(vertShader);
  if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS))
    throw new Error(
      'Could not compile vertex shader: ' + gl.getShaderInfoLog(vertShader)
    );

  const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShader, fragShaderSrc);
  gl.compileShader(fragShader);
  if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))
    throw new Error(
      'Could not compile fragment shader: ' + gl.getShaderInfoLog(fragShader)
    );

  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error('Could not link program: ' + gl.getProgramInfoLog(program));
  gl.useProgram(program);

  const data = new Float32Array([1, 1, -1, 1, -1, -1, 1, -1]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const positionAttribLocation = gl.getAttribLocation(program, 'position');
  gl.vertexAttribPointer(
    positionAttribLocation,
    2,
    gl.FLOAT,
    false,
    2 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.enableVertexAttribArray(positionAttribLocation);

  const intensityUniformLocation = gl.getUniformLocation(program, 'intensity');
  const ballsUniformLocation = gl.getUniformLocation(program, 'balls');

  const balls = [];
  for (let i = 0; i < maxBalls; i++) {
    balls[i] = new Ball();
  }
  const ballPositions = new Float32Array(maxBalls * 2);
  gl.uniform1f(intensityUniformLocation, 0.03);
  gl.uniform2fv(ballsUniformLocation, ballPositions);

  const resize = () => {
    w = innerWidth;
    h = innerHeight;

    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  };

  const loop = () => {
    requestAnimationFrame(loop);

    balls.forEach((ball, i) => {
      ball.update();
      ballPositions[i * 2] = ball.x;
      ballPositions[i * 2 + 1] = ball.y;
    });
    gl.uniform2fv(ballsUniformLocation, ballPositions);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  };

  addEventListener('resize', resize);
  resize();
  requestAnimationFrame(loop);
};
