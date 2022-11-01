class Boid {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = createVector(0, 0);
  }

  wrapBorders() {
    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    //this.acceleration.mult(0);

    // wrap around the screen borders
    this.wrapBorders();
  }

  show() {
    strokeWeight(1);
    stroke(255);
    noFill();

    // draw each boid as a triangle point in the direction of travel
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    triangle(10, 0, -10, 5, -10, -5);
    pop();
  }
}
