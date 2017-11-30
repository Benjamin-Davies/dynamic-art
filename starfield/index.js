const numberOfStars = 500;

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
    fetch('./main.frag.glsl').then(r => r.text())
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

  const data = new Float32Array(numberOfStars * 8);
  for (let i = 0; i < numberOfStars; i++) {
    const x = Math.random() * 4 - 2,
      y = Math.random() * 4 - 2,
      z = Math.random();
    data[i * 8] = x;
    data[i * 8 + 1] = y;
    data[i * 8 + 2] = z;
    data[i * 8 + 3] = 0;
    data[i * 8 + 4] = x;
    data[i * 8 + 5] = y;
    data[i * 8 + 6] = z;
    data[i * 8 + 7] = 1;
  }
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const positionAttribLocation = gl.getAttribLocation(program, 'position');
  gl.vertexAttribPointer(
    positionAttribLocation,
    3,
    gl.FLOAT,
    false,
    4 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.enableVertexAttribArray(positionAttribLocation);
  const posInRayAttribLocation = gl.getAttribLocation(program, 'posInRay');
  gl.vertexAttribPointer(
    posInRayAttribLocation,
    1,
    gl.FLOAT,
    false,
    4 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(posInRayAttribLocation);

  let t = 0,
    dt = 0.02;
  const tUniformLocation = gl.getUniformLocation(program, 't');
  const dtUniformLocation = gl.getUniformLocation(program, 'dt');

  const resize = () => {
    w = innerWidth;
    h = innerHeight;

    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  };

  const loop = () => {
    requestAnimationFrame(loop);

    for (let i = 2; i < data.length; i += 4) if (data[i] < t) data[i] += 1;
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

    t += dt;
    gl.uniform1f(tUniformLocation, t);
    gl.uniform1f(dtUniformLocation, dt);

    gl.clearColor(0, 0, 0, 0.8);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.LINES, 0, numberOfStars * 2);
  };

  addEventListener('resize', resize);
  document.addEventListener('mousemove', ev => (dt = ev.pageX / w * 0.05));
  resize();
  requestAnimationFrame(loop);
};
