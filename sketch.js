const FLOCK_SIZE = 100;
let boids = Array();

let perceptionSlider;
let separationSlider;
let cohesionSlider;
let alignmentSlider;
let resetButton;

let sliders = [];

function createFlock() {
  boids = [];

  // create a number of randomly distributed boids
  for (let i = 0; i < FLOCK_SIZE; i++) {
    let p = createVector(random(width), random(height));
    //let v = createVector(0, 0);
    let v = p5.Vector.random2D();
    boids.push(new Boid(p, v));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  perceptionSlider = createSlider(10, 500, 100);
  sliders.push({ slider: perceptionSlider, label: "perception radius" });

  separationSlider = createSlider(0, 2, 1, 0.01);
  sliders.push({ slider: separationSlider, label: "separation" });

  cohesionSlider = createSlider(0, 2, 1, 0.01);
  sliders.push({ slider: cohesionSlider, label: "cohesion" });

  alignmentSlider = createSlider(0, 2, 1, 0.01);
  sliders.push({ slider: alignmentSlider, label: "alignment" });

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
    boid.update();
    boid.show();
  }

  // slider labels
  textSize(15);
  noStroke();
  fill(255);
  sliders.forEach(displaySliderLabels);

  // framerate
  text(frameRate().toFixed(2), width - 50, 50);
}
