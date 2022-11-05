const FLOCK_SIZE = 100;
const boids = Array();

let perceptionSlider;

function setup() {
  createCanvas(windowWidth, windowHeight);

  perceptionSlider = createSlider(10, 500, 100);
  perceptionSlider.position(10, 10);
  perceptionSlider.style("width", "80px");

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
  let qtree = new QuadTree(boundary, 4);

  for (let boid of boids) {
    p = new Point(boid.position.x, boid.position.y, boid);
    qtree.insert(p);
    boid.update();
    boid.show();
  }

  qtree.show();

  // test the query code using the mouse
  range = new Circle(mouseX, mouseY, perceptionSlider.value());
  //r = new Rectangle(mouseX, mouseY, 100, 100);
  strokeWeight(1);
  stroke("green");
  circle(range.x, range.y, range.radius * 2);

  let points = qtree.query(range);
  // console.log(points);
  if (points.length > 0) {
    strokeWeight(5);
    stroke("red");
    for (let p of points) {
      point(p.x, p.y);
    }
  }

  // slider labels
  textSize(15);
  noStroke();
  fill(255);
  text(
    "perception radius",
    perceptionSlider.x * 2 + perceptionSlider.width,
    perceptionSlider.y + 15
  );
}
