const FLOCK_SIZE = 100;

const boids = Array();
let quadTree = null;

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
  let boundary = new Quadrant(width / 2, height / 2, width / 2, height / 2);
  let quadTree = new QuadTree(boundary, 4);

  for (let boid of boids) {
    quadTree.insert(boid);
    boid.update();
    boid.show();
  }

  quadTree.show();
}
