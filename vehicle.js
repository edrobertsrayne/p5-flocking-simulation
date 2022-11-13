class Vehicle {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 1;
    this.maxAcceleration = 0.2;
    this.mass = 1;
    this.drift = this.velocity.copy().normalize();
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
    const driftSize = 20;
    const pathLength = 100;

    this.drift.add(p5.Vector.random2D());
    this.drift.normalize();
    this.drift.mult(driftSize);

    let path = this.velocity.copy();
    path.setMag(pathLength);
    path.add(this.position);

    let target = p5.Vector.add(path, this.drift);

    if (debug) {
      noFill();
      stroke("cyan");
      line(this.position.x, this.position.y, path.x, path.y);
      line(path.x, path.y, target.x, target.y);
      circle(path.x, path.y, driftSize * 2);
    }

    return this.seek(target);
  }

  edges(margin) {
    if (margin === undefined) {
      margin = 50;
    }

    let desired = createVector(0);

    if (this.position.x < margin) {
      desired.add(this.maxSpeed, this.velocity.y);
      if (this.drift.x < 0) {
        this.drift.x = -this.drift.x;
      }
    } else if (this.position.x > width - margin) {
      desired.add(-this.maxSpeed, this.velocity.y);
      if (this.drift.x > 0) {
        this.drift.x = -this.drift.x;
      }
    }

    if (this.position.y < margin) {
      desired.add(this.velocity.x, this.maxSpeed);
      if (this.drift.y < 0) {
        this.drift.y = -this.drift.y;
      }
    } else if (this.position.y > height - margin) {
      desired.add(this.velocity.x, -this.maxSpeed);
      if (this.drift.y > 0) {
        this.drift.y = -this.drift.y;
      }
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
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }
}
