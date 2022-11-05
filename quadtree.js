class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains(point) {
    return (
      point.x > this.x - this.width &&
      point.x <= this.x + this.width &&
      point.y > this.y - this.height &&
      point.y <= this.y + this.height
    );
  }

  intersects(rectangle) {
    let dx = Math.abs(this.x - rectangle.x);
    let dy = Math.abs(this.y - rectangle.y);
    return !(
      dx > this.width + rectangle.width || dy > this.height + rectangle.height
    );
  }
}

class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rSquared = Math.pow(this.radius, 2);
  }

  contains(point) {
    return (
      Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2) <=
      this.rSquared
    );
  }

  intersects(rectangle) {
    let dx = Math.abs(this.x - rectangle.x);
    let dy = Math.abs(this.y - rectangle.y);

    // treat as if a rectangle
    if (
      dx > this.radius + rectangle.width ||
      dy > this.radius + rectangle.height
    ) {
      return false;
    }
    // there are probably some optimisations that I could make here.
    return true;
  }
}

class Point {
  constructor(x, y, data) {
    this.x = x;
    this.y = y;
    this.data = data;
  }
}

class QuadTree {
  constructor(boundary, n) {
    this.boundary = boundary;
    this.maxPoints = n || 4;
    this.points = Array();
    this.children = Array();
  }

  divide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.width / 2;
    let h = this.boundary.height / 2;

    let b = new Rectangle(x + w, y + h, w, h);
    this.children.push(new QuadTree(b, this.maxPoints));
    b = new Rectangle(x + w, y - h, w, h);
    this.children.push(new QuadTree(b, this.maxPoints));
    b = new Rectangle(x - w, y + h, w, h);
    this.children.push(new QuadTree(b, this.maxPoints));
    b = new Rectangle(x - w, y - h, w, h);
    this.children.push(new QuadTree(b, this.maxPoints));
  }

  /** push an item onto the child nodes */
  push(point) {
    for (let c of this.children) {
      if (c.insert(point)) return true;
    }
    //console.error("Unable to push item onto child node.");
    return false;
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.points.length < this.maxPoints) {
      this.points.push(point);
      return true;
    } else {
      if (this.children.length < 1) {
        this.divide();
        /* for (let p of this.items) {
          this.push(i);
        } */
      }

      return this.push(point);
    }
  }

  query(range, found) {
    if (!found) {
      found = [];
    }

    // if no overalap return an empty array
    if (!range.intersects(this.boundary)) {
      return found;
    }

    // add the points in this node
    for (let p of this.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }
    // query child nodes
    for (let child of this.children) {
      child.query(range, found);
    }
    return found;
  }

  show() {
    // draw this quadrant
    stroke(63);
    strokeWeight(1);
    rectMode(CENTER);
    rect(
      this.boundary.x,
      this.boundary.y,
      this.boundary.width * 2,
      this.boundary.height * 2
    );

    // draw any child quadrants
    if (this.children.length > 0) {
      for (let c of this.children) c.show();
    }
  }
}
