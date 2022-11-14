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
      this.maxSpeed = this.defaultMaxSpeed * 1.5;
    } else {
      this.maxSpeed = this.defaultMaxSpeed;
    }
    super.update(force);
  }

  avoidObstacles() {
    let force = createVector(0);

    for (let o of obstacles) {
      force.add(this.collision(o));
    }

    return force;
  }

  huntPrey() {
    if (this.target == null) {
      // if I don't have a target, 0.1% chance of acquiring one
      this.target = random(boids);
      if (debug) {
        console.log("Target acquired");
        console.log(boids.indexOf(this.target));
      }
    } else {
      // if close enough (half feeding range) consume the boid otherwise continue the chase
      if (
        dist(
          this.position.x,
          this.position.y,
          this.target.position.x,
          this.target.position.y
        ) <
        this.feedingRadius / 2
      ) {
        if (debug) {
          console.log("Gotcha!");
        }
        boids.splice(boids.indexOf(this.target), 1);
        flockSizeSlider.value(boids.length);
        this.target = null;
      } else {
        // keep chasing
        return this.pursue(this.target);
      }
    }
    return createVector(0);
  }
}
