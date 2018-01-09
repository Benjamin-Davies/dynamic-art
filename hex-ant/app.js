// Uncomment for intelisense on gl-matrix functions
// import { vec2, mat2 } from 'gl-matrix';

((doc, win) => {
  'use strict';
  // Hex Ant
  // Langton's Ant implemented on a hexagonal grid

  // Hexagonal grid reference: https://www.redblobgames.com/grids/hexagons/

  const canvas = doc.createElement('canvas');
  const container = doc.getElementById('canvasContainer');
  container.appendChild(canvas);
  canvas.width = 780;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  const fps = doc.getElementById('fps');
  const iter = doc.getElementById('iter');

  const r = 10,
    gridWidth = 45,
    gridHeight = 40,
    PI_OVER_3 = Math.PI / 3;

  const cells = new Array(gridWidth * gridHeight).fill(false);
  const ant = { pos: vec2.fromValues(12, 20), dir: 0 };

  window.paused = false;
  let frames = 0;
  let total = 0;
  setInterval(() => {
    fps.innerText = frames;
    frames = 0;
  }, 1000);

  const draw = () => {
    requestAnimationFrame(draw);
    frames++;
    if (window.paused) return;
    total++;
    iter.innerText = total;

    const index = ant.pos[0] + ant.pos[1] * gridWidth;
    if (cells[index]) ant.dir++;
    else ant.dir--;
    cells[index] = !cells[index];

    while (ant.dir >= 6) ant.dir -= 6;
    while (ant.dir < 0) ant.dir += 6;

    switch (ant.dir) {
      case 0:
        ant.pos[0]++;
        break;
      case 1:
        ant.pos[0]++;
        ant.pos[1]--;
        break;
      case 2:
        ant.pos[1]--;
        break;
      case 3:
        ant.pos[0]--;
        break;
      case 4:
        ant.pos[0]--;
        ant.pos[1]++;
        break;
      case 5:
        ant.pos[1]++;
        break;
    }

    while (ant.pos[0] >= gridWidth) ant.pos[0] -= gridWidth;
    while (ant.pos[0] < 0) ant.pos[0] += gridWidth;
    while (ant.pos[1] >= gridHeight) ant.pos[1] -= gridHeight;
    while (ant.pos[1] < 0) ant.pos[1] += gridHeight;

    const [x, y] = ant.pos;
    if (cells[x + y * gridWidth]) ctx.fillStyle = 'black';
    else ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    traceHex([x, y]);
    ctx.fill();
    ctx.stroke();
  };
  requestAnimationFrame(draw);

  const hexM = mat2.fromValues(Math.sqrt(3), 0, Math.sqrt(3) / 2, 1.5);
  mat2.multiplyScalar(hexM, hexM, r);

  const vertices = [];
  for (let i = 0; i < 6; i++) {
    const a = PI_OVER_3 * i;
    const v = vec2.fromValues(Math.sin(a), Math.cos(a));
    vec2.scale(v, v, r);
    vertices.push(v);
  }

  /**
   * @param {vec2} position Cube coordinates of the hexagon
   */
  const traceHex = (() => {
    const p = vec2.create(),
      screenPos = vec2.create();

    return position => {
      vec2.transformMat2(screenPos, position, hexM);
      screenPos[0] %= canvas.width;
      screenPos[1] += 5;

      ctx.beginPath();
      for (let v of vertices) {
        vec2.add(p, screenPos, v);
        ctx.lineTo(p[0], p[1]);
      }
      ctx.closePath();
    };
  })();
})(document, window);
