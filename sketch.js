const FLOCK_SIZE = 100;

const boids = Array();
let quadTree = null;
let points = Array();

function setup() {
  createCanvas(windowWidth, windowHeight);

  // create a number of randomly distributed boids
  for (let i = 0; i < FLOCK_SIZE; i++) {
    let p = createVector(random(width), random(height));
    //let v = createVector(0, 0);
    let v = p5.Vector.random2D();
    boids.push(new Boid(p, v));
  }
}

function draw() {
  background(0);

  // build a quadtree for this loop
  let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  let quadTree = new QuadTree(boundary, 4);

  for (let boid of boids) {
    p = new Point(boid.position.x, boid.position.y, boid);
    quadTree.insert(p);
    boid.update();
    boid.show();
  }

  quadTree.show();

  // test the query code using the mouse
  range = new Circle(mouseX, mouseY, 100);
  //r = new Rectangle(mouseX, mouseY, 100, 100);
  strokeWeight(1);
  stroke("green");
  circle(range.x, range.y, range.radius * 2);

  points = quadTree.query(range);
  // console.log(points);
  if (points.length > 0) {
    strokeWeight(5);
    stroke("red");
    for (let p of points) {
      point(p.x, p.y);
    }
  }
}
