class Vehicle {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 1;
    this.maxAcceleration = 0.5;
    this.mass = 1;
    this.drift = this.velocity.copy().normalize();
    this.radius = 10;
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

    let ahead = dist(
      this.position.x,
      this.position.y,
      target.position.x,
      target.position.y
    );
    ahead /= this.velocity.mag();

    let position = target.position.copy();
    position.add(target.velocity.copy().mult(ahead));

    if (debug) {
      stroke("green");
      fill("green");
      circle(position.x, position.y, 10);
    }
    let steer = this.seek(position);
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

  collision(obstacle) {
    // project the vehicle's path into the future
    let path = this.velocity.copy().mult(100);
    //path.add(this.position);
    if (debug) {
      stroke("rgba(255, 255, 0,0.25)");
      strokeWeight(this.radius);
      line(
        this.position.x,
        this.position.y,
        this.position.x + path.x,
        this.position.y + path.y
      );
    }

    // find the scalar projection of the obstacle's position onto the vehicle's path
    let a = p5.Vector.sub(obstacle.position, this.position);
    if (debug) {
      stroke(255);
      strokeWeight(1);
      line(obstacle.x, obstacle.y, this.position.x, this.position.y);
    }

    // calculate the scalar projection
    let b = path.copy();
    b.normalize();
    let sp = a.dot(b);

    // if the scalar projection falls on the path keep checking
    if (sp >= 0 && sp < path.mag()) {
      // calculate the vector projection
      b.mult(sp);
      let vp = p5.Vector.add(this.position, b);

      if (debug) {
        stroke(255, 255, 0);
        strokeWeight(4);
        point(vp.x, vp.y);
        strokeWeight(1);
        stroke(255);
        line(vp.x, vp.y, obstacle.x, obstacle.y);
      }

      if (
        dist(obstacle.x, obstacle.y, vp.x, vp.y) <
        obstacle.radius + this.radius
      ) {
        if (debug) {
          console.log("Avoid collision!");
        }
        return this.avoid(obstacle.position);
      }
    }

    return createVector(0);
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
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);

    this.acceleration.mult(0);
  }
}
