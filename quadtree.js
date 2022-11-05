class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains(point) {
    if (
      point.x > this.x - this.width &&
      point.x <= this.x + this.width &&
      point.y > this.y - this.height &&
      point.y <= this.y + this.height
    ) {
      return true;
    } else {
      return false;
    }
  }

  intersects(rectangle) {
    return !(
      this.x + this.width < rectangle.x - rectangle.width ||
      this.x - this.width > rectangle.x + rectangle.width ||
      this.y + this.height < rectangle.y - rectangle.height ||
      this.y - this.height > rectangle.y + rectangle.height
    );
  }
}

class Point {
  constructor(position, data) {
    this.x = position.x;
    this.y = position.y;
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
    if (!this.boundary.intersects(range)) {
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
