class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains(position) {
    if (
      position.x > this.x - this.width &&
      position.x <= this.x + this.width &&
      position.y > this.y - this.height &&
      position.y <= this.y + this.height
    ) {
      return true;
    } else {
      return false;
    }
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
    if (!this.boundary.contains(point.position)) {
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
