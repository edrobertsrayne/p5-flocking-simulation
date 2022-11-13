class Vehicle {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 5;
    this.maxAcceleration = 0.2;
    this.mass = 1;
  }

  wrap() {
    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    return steer;
  }

  avoid(target) {
    return this.seek(target).mult(-1);
  }

  pursue(target) {
    console.assert(target instanceof Vehicle);

    let position = target.position.copy();
    position.add(target.velocity.copy().mult(50));

    if (debug) {
      stroke("green");
      fill("green");
      circle(position.x, position.y, 10);
    }
    let steer = this.seek(position).mult(250);
    let distance = p5.Vector.sub(this.position, position);
    steer.div(distance.magSq() + 0.001);
    return steer;
  }

  flee(target) {
    return this.pursue(target).mult(-1);
  }

  wander() {
    const maxDrift = 0.5;
    const pathLenght = 100;
    const driftSize = 20;

    let path = p5.Vector.mult(this.velocity, pathLenght);
    let driftAngle = random(-maxDrift, maxDrift);
    let drift = path.copy().normalize();
    let driftfHeading = path.heading() + driftAngle;
    drift.setHeading(driftfHeading);
    drift.mult(driftSize);
    if (debug) {
      push();
      translate(this.position.x, this.position.y);
      stroke("cyan");
      line(0, 0, path.x, path.y);
      circle(path.x, path.y, driftSize * 2);
      line(path.x, path.y, path.x + drift.x, path.y + drift.y);
      pop();
    }
    let target = p5.Vector.add(path, this.position);
    target.add(drift);
    return this.seek(target);
  }

  edges(margin) {
    if (margin === undefined) {
      margin = 50;
    }

    let desired = createVector(0);

    if (this.position.x < margin) {
      desired.add(this.maxSpeed, this.velocity.y);
    } else if (this.position.x > width - margin) {
      desired.add(-this.maxSpeed, this.velocity.y);
    }

    if (this.position.y < margin) {
      desired.add(this.velocity.x, this.maxSpeed);
    } else if (this.position.y > height - margin) {
      desired.add(this.velocity.x, -this.maxSpeed);
    }

    if (debug) {
      stroke(127);
      noFill();
      rect(margin, margin, width - 2 * margin, height - 2 * margin);
    }

    return p5.Vector.sub(desired, this.velocity);
  }

  update(force) {
    // apply the force and limit the accleration
    this.acceleration = p5.Vector.div(force, this.mass);
    this.acceleration.limit(this.maxAcceleration);

    // update the position
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(1);
    this.acceleration.mult(0);
  }
}
