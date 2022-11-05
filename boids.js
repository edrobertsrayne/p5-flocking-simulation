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

  update(maxSpeed) {
    if (!maxSpeed) {
      maxSpeed = 1;
    }
    // update the position
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(1);
    this.acceleration.mult(0);

    // wrap around the screen borders
    this.wrapBorders();
  }

  separation(others) {
    let acceleration = createVector(0, 0);
    return acceleration;
  }

  alignment(others) {
    let acceleration = createVector(0, 0);
    return acceleration;
  }

  cohesion(others, effectSize) {
    let acceleration = createVector(0, 0);

    // calculate the average position vectors of the
    let averagePosition = createVector(0, 0);
    for (let other of others) {
      averagePosition.add(other.data.position);
    }
    averagePosition.div(others.length);

    acceleration = p5.Vector.sub(averagePosition, this.position);
    acceleration.normalize();
    acceleration.mult(effectSize);

    this.acceleration.add(acceleration);
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
