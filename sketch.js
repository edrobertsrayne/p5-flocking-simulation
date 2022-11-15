const FLOCK_SIZE = 50;
const NUM_OBSTACLES = 10;

let boids = Array();
let predators = Array();
let obstacles = Array();

let debug = false;

let flockSizeSlider;
let perceptionSlider;
let separationSlider;
let cohesionSlider;
let alignmentSlider;
let edgeAvoidSlider;
let resetButton;
let seekSlider;

let dragObject = null;

let sliders = [];

function createObstacles() {
  for (let i = 0; i < NUM_OBSTACLES; i++) {
    let x = random(0, width);
    let y = random(0, height);
    let r = random(10, width / 20);
    obstacles.push(new Obstacle(x, y, r));
  }
}

function createBoid() {
  let p = createVector(random(width), random(height));
  let v = p5.Vector.random2D();
  boids.push(new Boid(p, v));
}

function createFlock() {
  boids = [];

  // create a number of randomly distributed boids
  for (let i = 0; i < flockSizeSlider.value(); i++) {
    createBoid();
  }
}

function createSliders() {
  flockSizeSlider = createSlider(10, 1000, FLOCK_SIZE);
  sliders.push({ slider: flockSizeSlider, label: "flock size" });

  perceptionSlider = createSlider(5, 500, 50);
  sliders.push({ slider: perceptionSlider, label: "perception radius" });

  separationSlider = createSlider(0, 2, 0.8, 0.01);
  sliders.push({ slider: separationSlider, label: "separation" });

  cohesionSlider = createSlider(0, 2, 0.8, 0.01);
  sliders.push({ slider: cohesionSlider, label: "cohesion" });

  alignmentSlider = createSlider(0, 2, 0.8, 0.01);
  sliders.push({ slider: alignmentSlider, label: "alignment" });

  edgeAvoidSlider = createSlider(0, 1, 0, 0.01);
  sliders.push({ slider: edgeAvoidSlider, label: "edge avoidance" });

  seekSlider = createSlider(-1, 1, 0, 0.01);
  sliders.push({ slider: seekSlider, label: "seek the mouse" });

  sliders.forEach(setSliderProperties);

  resetButton = createButton("Reset simulation");
  let size = resetButton.size();
  resetButton.position(width - 10 - size.width, 10);
  resetButton.mousePressed(createFlock);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  createSliders();

  createFlock();

  createObstacles();

  let p = createVector(random(width), random(height));
  let v = p5.Vector.random2D().mult(2);
  let predator = new Predator(p, v);
  predator.defaultMaxSpeed = 1.5;
  predator.maxAcceleration = 0.1;
  predators.push(predator);
}

function setSliderProperties(value, index, array) {
  value.slider.position(10, 10 + index * 30);
  value.slider.style("width", "80px");
}

function displaySliderLabels(value, index, array) {
  text(
    value.label.concat(" (", value.slider.value(), ")"),
    value.slider.x * 2 + value.slider.width,
    value.slider.y + 15
  );
}

function draw() {
  background(0);

  // update the flock size if required
  while (boids.length < flockSizeSlider.value()) {
    createBoid();
  }
  while (boids.length > flockSizeSlider.value()) {
    boids.pop();
  }

  for (let obstacle of obstacles) {
    obstacle.show();
  }

  calculateBoids();
  calculatePredators();

  // slider labels
  textSize(15);
  noStroke();
  fill(255);
  sliders.forEach(displaySliderLabels);

  // framerate
  text(frameRate().toFixed(2), width - 50, 30 + resetButton.size().height);
}

function mousePressed() {
  for (let obstacle of obstacles) {
    if (dist(mouseX, mouseY, obstacle.x, obstacle.y) < obstacle.radius) {
      if (debug) {
        console.log("Obstacle grabbed.");
      }
      dragObject = obstacle;
      dragObject.offsetX = dragObject.x - mouseX;
      dragObject.offsetY = dragObject.y - mouseY;
      return;
    }
  }
}

function mouseReleased() {
  dragObject = null;
}

function mouseDragged() {
  if (dragObject) {
    dragObject.move(mouseX + dragObject.offsetX, mouseY + dragObject.offsetY);
  }
}

function calculateBoids() {
  // build a quadtree for this loop and populate it
  let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  let qtree = new QuadTree(boundary, 4);
  for (let boid of boids) {
    p = new Point(boid.position.x, boid.position.y, boid);
    qtree.insert(p);
  }

  let mouseTarget = createVector(mouseX, mouseY);

  for (let boid of boids) {
    let force = createVector(0);

    // find the nearby boids to use in flocking calculations
    range = new Circle(
      boid.position.x,
      boid.position.y,
      perceptionSlider.value()
    );
    if (debug) {
      noFill();
      stroke(50);
      circle(range.x, range.y, range.radius * 2);
    }
    others = qtree.query(range);

    // avoid obstacles

    dodge = boid.avoidObstacles();
    dodge.mult(100);
    force.add(dodge);

    // if there's a predator nearby, run away!
    p = boid.fleePredators();
    p.mult(10);
    force.add(p);

    // otherwise calculate flocking behaviours
    if (others.length > 0) {
      force.add(boid.cohesion(others).mult(cohesionSlider.value()));
      force.add(boid.alignment(others).mult(alignmentSlider.value()));
      force.add(boid.separation(others).mult(separationSlider.value()));
    }

    // edge avoid and seek
    //force.add(boid.edges().mult(0.2));
    if (seekSlider.value() != 0) {
      force.add(boid.seek(mouseTarget).mult(seekSlider.value()));
    }

    boid.update(force);
    boid.wrap();
    boid.show();
  }
}

function calculatePredators() {
  for (let predator of predators) {
    // avoid obstacles
    let dodge = predator.avoidObstacles();
    dodge.mult(100);

    let prey = predator.huntPrey();
    prey.mult(10);
    let wander = predator.wander();

    let force = dodge;
    force.add(prey);
    force.add(wander);

    predator.update(force);
    predator.wrap();
    predator.show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let size = resetButton.size();
  resetButton.position(width - 10 - size.width, 10);
}
