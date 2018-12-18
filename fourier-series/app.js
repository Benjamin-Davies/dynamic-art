import { sizes, colours } from './config.js';
import { plot, drawEpicycle } from './drawing.js';

/**
 * @param {HTMLCanvasElement} canvas
 */
export function sine(canvas) {
  canvas.width = (2 + 2 * Math.PI) * sizes.unit + 3 * sizes.margin;
  canvas.height = 2 * sizes.unit + 2 * sizes.margin;
  const ctx = canvas.getContext('2d');

  function draw() {
    requestAnimationFrame(draw);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(sizes.unit + sizes.margin, sizes.unit + sizes.margin);
    drawEpicycle(ctx, 1, 1);
    ctx.restore();

    ctx.save();
    ctx.translate(2 * sizes.unit + 2 * sizes.margin, sizes.unit + sizes.margin);
    plot(ctx, t => {
      const theta = 2 * Math.PI * t;
      return [theta, Math.sin(theta)];
    });
    ctx.restore();
  }
  requestAnimationFrame(draw);
}
