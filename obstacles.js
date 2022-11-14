class Obstacle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.radius = r;
    this.diameter = 2 * r;
    this.radiusSq = r * r;
    this.offsetX = 0;
    this.offsetY = 0;
    this.position = createVector(x, y);
  }

  move(x, y) {
    this.x = x;
    this.y = y;
    this.position.set(x, y);
  }

  show() {
    strokeWeight(1);
    stroke("mediumpurple");
    fill("indigo");
    circle(this.x, this.y, this.diameter);
  }
}
