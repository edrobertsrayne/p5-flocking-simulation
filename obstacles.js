class Obstacle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.radius = r;
  }

  show() {
    stroke("mediumpurple");
    fill("indigo");
    circle(this.x, this.y, this.radius * 2);
  }
}
