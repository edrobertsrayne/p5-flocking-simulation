class Predator extends Vehicle {
  constructor(position, velocity) {
    super(position, velocity);
    this.target = null;
    this.feedingRadius = 100;
    this.defaultMaxSpeed = this.maxSpeed;
    this.radius = 10;
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
  update(force) {
    let maxSpeed;
    if (this.target != null) {
      this.maxSpeed = this.defaultMaxSpeed * 2;
    } else {
      this.maxSpeed = this.defaultMaxSpeed;
    }
    super.update(force);
  }
}
