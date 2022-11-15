class Boid extends Vehicle {
  constructor(position, velocity) {
    super(position, velocity);
  }

  separation(others) {
    if (others.length < 1) {
      console.assert(
        "No members of other array passed to separation function."
      );
      return;
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

    return p5.Vector.sub(this.velocity, desired);
  }

  alignment(others) {
    if (others.length < 1) {
      console.assert("No members of other array passed to alignment function.");
      return;
    }

    let averageVelocity = createVector(0, 0);
    for (let other of others) {
      averageVelocity.add(other.data.velocity);
    }
    averageVelocity.normalize();
    averageVelocity.mult(this.maxSpeed);
    return p5.Vector.sub(averageVelocity, this.velocity);
  }

  cohesion(others) {
    if (others.length < 1) {
      console.assert("No members of other array passed to cohesion function.");
      return;
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

    return p5.Vector.sub(desired, this.velocity);
  }

  avoidObstacles() {
    let force = createVector(0);

    for (let o of obstacles) {
      force.add(this.collision(o));
    }

    return force;
  }

  fleePredators() {
    let force = createVector(0);
    for (let predator of predators) {
      if (
        dist(
          this.position.x,
          this.position.y,
          predator.position.x,
          predator.position.y
        ) < predator.feedingRadius
      ) {
        force.add(this.flee(predator));
        force.add(this.avoid(predator.position).mult(2));
      }
    }
    return force;
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
