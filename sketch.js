const FLOCK_SIZE = 100;
let boids = Array();

let flockSizeSlider;
let perceptionSlider;
let separationSlider;
let cohesionSlider;
let alignmentSlider;
let edgeAvoidSlider;
let resetButton;
let seekSlider;

let sliders = [];

function createFlock() {
  boids = [];

  // create a number of randomly distributed boids
  for (let i = 0; i < flockSizeSlider.value(); i++) {
    let p = createVector(random(width), random(height));
    //let v = createVector(0, 0);
    let v = p5.Vector.random2D();
    boids.push(new Boid(p, v));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

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

  seekSlider = createSlider(0, 1, 0, 0.01);
  sliders.push({ slider: seekSlider, label: "seek the mouse" });

  sliders.forEach(setSliderProperties);

  resetButton = createButton("Reset simulation");
  let size = resetButton.size();
  resetButton.position(width - 10 - size.width, 10);
  resetButton.mousePressed(createFlock);

  createFlock();
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

  // build a quadtree for this loop
  let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  let qtree = new QuadTree(boundary, 4);

  for (let boid of boids) {
    p = new Point(boid.position.x, boid.position.y, boid);
    qtree.insert(p);
  }

  let mouseTarget = createVector(mouseX, mouseY);

  for (let boid of boids) {
    range = new Circle(
      boid.position.x,
      boid.position.y,
      perceptionSlider.value()
    );
    others = qtree.query(range);

    if (others.length > 0) {
      boid.cohesion(others, cohesionSlider.value());
      boid.alignment(others, alignmentSlider.value());
      boid.separation(others, separationSlider.value());
    }

    // edge avoid
    let steer = createVector(0);
    let desired = createVector(0);
    let EDGE_WIDTH = 100;
    if (boid.position.x < EDGE_WIDTH) {
      desired.add(boid.maxSpeed, boid.velocity.y);
    } else if (boid.position.x > width - EDGE_WIDTH) {
      desired.add(-boid.maxSpeed, boid.velocity.y);
    }

    if (boid.position.y < EDGE_WIDTH) {
      desired.add(boid.velocity.x, boid.maxSpeed);
    } else if (boid.position.y > height - EDGE_WIDTH) {
      desired.add(boid.velocity.x, -boid.maxSpeed);
    }
    steer = p5.Vector.sub(desired, boid.velocity);
    steer.mult(edgeAvoidSlider.value());
    boid.acceleration.add(steer);

    // mouse seek
    boid.seek(mouseTarget, seekSlider.value());

    boid.update();
    boid.show();
  }

  // slider labels
  textSize(15);
  noStroke();
  fill(255);
  sliders.forEach(displaySliderLabels);

  // framerate
  text(frameRate().toFixed(2), width - 50, 30 + resetButton.size().height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let size = resetButton.size();
  resetButton.position(width - 10 - size.width, 10);
}
