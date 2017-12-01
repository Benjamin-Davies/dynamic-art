export default class {
  constructor() {
    this.x = Math.random() * 2 - 1;
    this.y = Math.random() * 2 - 1;

    const theta = Math.random() * 2 * Math.PI;
    this.velX = Math.cos(theta);
    this.velY = Math.sin(theta);
  }

  update() {
    const dt = 0.02;
    this.x += this.velX * dt;
    this.y += this.velY * dt;

    if (this.x > 1 || this.x < -1) this.velX *= -1;
    if (this.y > 1 || this.y < -1) this.velY *= -1;
  }
}
