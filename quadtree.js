class Quadrant {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class QuadTree {
  constructor(boundary, n) {
    this.boundary = boundary;
    this.maxItems = n || 4;
    this.items = Array();
    this.children = Array();
  }

  createChildren() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.width / 2;
    let h = this.boundary.height / 2;

    let b = new Quadrant(x + w, y + h, w, h);
    this.children.push(new QuadTree(b, this.maxItems));
    b = new Quadrant(x + w, y - h, w, h);
    this.children.push(new QuadTree(b, this.maxItems));
    b = new Quadrant(x - w, y + h, w, h);
    this.children.push(new QuadTree(b, this.maxItems));
    b = new Quadrant(x - w, y - h, w, h);
    this.children.push(new QuadTree(b, this.maxItems));
  }

  /** push an item onto the child nodes */
  pushItem(item) {
    for (let c of this.children) {
      if (c.insert(item)) return true;
    }
    //console.error("Unable to push item onto child node.");
    return false;
  }

  isWithinBoundary(position) {
    if (
      position.x > this.boundary.x - this.boundary.width &&
      position.x <= this.boundary.x + this.boundary.width &&
      position.y > this.boundary.y - this.boundary.height &&
      position.y <= this.boundary.y + this.boundary.height
    ) {
      return true;
    } else {
      return false;
    }
  }

  insert(item) {
    if (!this.isWithinBoundary(item.position)) {
      return false;
    }

    if (this.items.length < this.maxItems) {
      this.items.push(item);
      return true;
    } else {
      if (this.children.length < 1) {
        this.createChildren();
        for (let i of this.items) {
          this.pushItem(i);
        }
      }

      return this.pushItem(item);
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
