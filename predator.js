class Predator extends Vehicle {
  constructor(position, velocity) {
    super(position, velocity);
    this.target = null;
    this.feedingRadius = 100;
  }

  show() {
    strokeWeight(2);
    stroke("red");
    fill("darkred");

    // draw each boid as a triangle point in the direction of travel
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    triangle(20, 0, -20, 10, -20, -10);

    if (debug) {
      noFill();
      stroke("darkred");
      circle(0, 0, this.feedingRadius * 2);
    }
    pop();
  }
}
