const FLOCK_SIZE = 100;
let boids = Array();
let predators = Array();

const debug = false;

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

  seekSlider = createSlider(-1, 1, 0, 0.01);
  sliders.push({ slider: seekSlider, label: "seek the mouse" });

  sliders.forEach(setSliderProperties);

  resetButton = createButton("Reset simulation");
  let size = resetButton.size();
  resetButton.position(width - 10 - size.width, 10);
  resetButton.mousePressed(createFlock);

  createFlock();

  let p = createVector(random(width), random(height));
  let v = p5.Vector.random2D();
  let predator = new Predator(p, v);
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
    if (debug) {
      noFill();
      stroke(50);
      circle(range.x, range.y, range.radius * 2);
    }
    others = qtree.query(range);

    let force = createVector(0);
    if (others.length > 0) {
      force.add(boid.cohesion(others).mult(cohesionSlider.value()));
      force.add(boid.alignment(others).mult(alignmentSlider.value()));
      force.add(boid.separation(others).mult(separationSlider.value()));
      if (debug) {
        for (let other of others) {
          noFill();
          stroke(75);
          line(
            boid.position.x,
            boid.position.y,
            other.data.position.x,
            other.data.position.y
          );
        }
      }
    }
    /*
    // edge avoid

    // mouse seek
    boid.seek(mouseTarget, seekSlider.value());
*/
    if (seekSlider.value() != 0) {
      force.add(boid.seek(mouseTarget).mult(seekSlider.value()));
    }

    boid.update(force);
    boid.wrap();
    boid.show();
  }

  for (let predator of predators) {
    let force = predator.wander();
    force.add(predator.edges().mult(0.2));
    predator.update(force);
    predator.wrap();
    predator.show();
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
