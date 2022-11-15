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
    this.colour = this.setColour();
  }

  setColour() {
    const colours = ["indigo", "mediumpurple", "cornflowerblue", "darkslateblue", "orchid", "steelblue"];
    return random(colours);
  }

  move(x, y) {
    this.x = x;
    this.y = y;
    this.position.set(x, y);
  }

  show() {
    strokeWeight(1);
    let c = color(this.colour);
    stroke(c);
    c.setAlpha(128);
    fill(c);
    circle(this.x, this.y, this.diameter);
  }
}
