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
    if (others.length < 1) {
      console.assert(
        "No members of other array passed to separation function."
      );
      return;
    }
    let acceleration = createVector(0, 0);
  }

  alignment(others, effectSize) {
    if (others.length < 1) {
      console.assert("No members of other array passed to alignment function.");
      return;
    }
    if (effectSize === null) {
      effectSize = 0.2;
    }
    let averageVelocity = createVector(0, 0);
    for (let other of others) {
      averageVelocity.add(other.data.velocity);
    }
    averageVelocity.div(others.length);
    let acceleration = createVector(0, 0);
    acceleration = p5.Vector.sub(averageVelocity, this.velocity);
    acceleration.normalize();
    acceleration.mult(effectSize);

    this.acceleration.add(acceleration);
  }

  cohesion(others, effectSize) {
    if (others.length < 1) {
      console.assert("No members of other array passed to cohesion function.");
      return;
    }
    if (effectSize === null) {
      effectSize = 0.2;
    }
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
