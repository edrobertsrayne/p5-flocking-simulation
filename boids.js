class Boid {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 5;
    this.maxAcceleration = 0.2;
  }

  wrapBorders() {
    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
  }

  setMaxSpeed(maxSpeed) {
    this.maxSpeed = maxSpeed;
  }

  setMaxAcceleration(maxAcceleration) {
    this.maxAcceleration = maxAcceleration;
  }

  update() {
    // limit the accleration
    this.acceleration.limit(this.maxAcceleration);
    // update the position
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(1);
    this.acceleration.mult(0);

    // wrap around the screen borders
    this.wrapBorders();
  }

  separation(others, effectSize) {
    if (others.length < 1) {
      console.assert(
        "No members of other array passed to separation function."
      );
      return;
    }
    if (effectSize === null) {
      effectSize = 0.2;
    }
    let weightedPosition = createVector(0, 0);
    let desired = createVector(0, 0);
    for (let other of others) {
      weightedPosition = p5.Vector.sub(other.data.position, this.position);
      if (weightedPosition.mag() > 0) {
        weightedPosition.div(weightedPosition.mag());
      }
      desired.add(weightedPosition);
    }
    desired.normalize();
    desired.mult(this.maxSpeed);

    let steering = p5.Vector.sub(this.velocity, desired);
    steering.mult(effectSize);
    this.acceleration.add(steering);
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
    averageVelocity.normalize();
    averageVelocity.mult(this.maxSpeed);
    let steering = p5.Vector.sub(averageVelocity, this.velocity);
    steering.mult(effectSize);

    this.acceleration.add(steering);
  }

  cohesion(others, effectSize) {
    if (others.length < 1) {
      console.assert("No members of other array passed to cohesion function.");
      return;
    }
    if (effectSize === null) {
      effectSize = 0.2;
    }
    let desired = createVector(0, 0);

    // calculate the average position vectors of the
    let averagePosition = createVector(0, 0);
    for (let other of others) {
      averagePosition.add(other.data.position);
    }
    averagePosition.div(others.length);

    desired = p5.Vector.sub(averagePosition, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);

    let steering = p5.Vector.sub(desired, this.velocity);
    steering.mult(effectSize);
    this.acceleration.add(steering);
  }

  seek(target, effectSize) {
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.mult(effectSize);
    steer.limit(this.maxAcceleration);
    this.acceleration.add(steer);
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
