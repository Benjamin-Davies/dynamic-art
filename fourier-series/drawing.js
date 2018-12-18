import { sizes, colours } from './config.js';

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {(t: number) => [number, number]} f
 * @param {number} points
 */
export function plot(ctx, f, points = 200) {
  ctx.lineWidth = sizes.lineWidth;
  ctx.strokeStyle = colours.path;
  ctx.beginPath();
  const start = f(0);
  ctx.moveTo(sizes.unit * start[0], -sizes.unit * start[1]);
  for (let i = 1; i <= points; i++) {
    const point = f(i / points);
    ctx.lineTo(sizes.unit * point[0], -sizes.unit * point[1]);
  }
  ctx.stroke();

  const current = f(getTime());
  drawPoint(ctx, sizes.unit * current[0], -sizes.unit * current[1]);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} frequency
 * @param {number} amplitude
 */
export function drawEpicycle(ctx, frequency, amplitude) {
  ctx.lineWidth = sizes.lineWidth;
  ctx.strokeStyle = colours.circle;
  ctx.beginPath();
  ctx.ellipse(
    0,
    0,
    sizes.unit * amplitude,
    sizes.unit * amplitude,
    0,
    0,
    2 * Math.PI
  );
  ctx.stroke();

  const theta = 2 * Math.PI * getTime();
  const x = sizes.unit * Math.cos(theta);
  const y = -sizes.unit * Math.sin(theta);
  ctx.strokeStyle = colours.line;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(x, y);
  ctx.stroke();
  drawPoint(ctx, x, y);

  ctx.translate(x, y);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 */
export function drawPoint(ctx, x, y) {
  ctx.fillStyle = colours.point;
  ctx.beginPath();
  ctx.ellipse(x, y, sizes.dotRadius, sizes.dotRadius, 0, 0, 2 * Math.PI);
  ctx.fill();
}

export function getTime() {
  return (performance.now() / 1000 / 5) % 1;
}
