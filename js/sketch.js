const total = 50;
let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;
let slider;
let birdBrain;
let bestLiveBirdBrain;
let isTraining = true;
let mutationRate = 0.2;
let crossOverRate = 0.01;
let sdValue = 0.1;
let generation = 1;
let highScore = 0;
let score = 0;


function preload() {
  birdBrain = loadJSON('data/best_bird3.json');
}

function setup() {
  bg = loadImage('assets/bg.png');
  createCanvas(400, 600);
  slider = createSlider(1, 20, 1)
  loadBestBird();
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {
    if (counter % 60 == 0) {
      pipes.push(new Pipe());
    }
    counter++;

    pipes.reverse().forEach((pipe, i) => {
      pipe.update();

      birds.reverse().forEach((bird, j) => {
        if (pipe.hits(bird)) {
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      });

      if (pipe.offscreen()) {
        pipes.splice(i, 1);
      }
    });

    birds.reverse().forEach((bird, j) => {
      if (bird.offscreen()) {
        savedBirds.push(birds.splice(j, 1)[0]);
      }
    });

    for (let bird of birds) {
      bird.think(pipes);
      bird.update();
    }

    if (birds.length == 0) {
      counter = 0;
      if (isTraining) {
        nextGeneration();
      } else {
        birds[i] = new Bird(new NeuralNetwork(json));
      }
      pipes = [];
    }
  }

  // all the drawing
  background(bg);

  for (let bird of birds) {
    bird.show();
  }

  for (let pipe of pipes) {
    pipe.show();
  }
  if (birds[0].score > highScore) {
    highScore = birds[0].score;
    bestLiveBirdBrain = birds[0].brain;
  }
  score = birds[0].score;

  document.getElementById('score').innerHTML = "Score :" + score;
  document.getElementById('heighscore').innerHTML = "Heigh Score :" + highScore;
  document.getElementById('generation').innerHTML = "Generation :" + generation;
  document.getElementById('speed').innerHTML = "Speed :" + slider.value();
  document.getElementById('mutation').innerHTML = "Mutation :" + mutationRate;
  document.getElementById('crossover').innerHTML = "Crossover :" + crossOverRate;
}

function keyPressed() {
  if (key == 'S' || key == 'S') {
    saveCurrentBestBird();
  }
  if (key == 'L' || key == 'l') {
    loadBestBird();
  }
  if (key == 'r' || key == 'R') {
    retrainBestBird();
  }
}

function saveCurrentBestBird() {
  let j = bestLiveBirdBrain.serialize();
  saveJSON(j, 'best_bird.json');
}

function loadBestBird() {
  isNotTraining = false;
  for (const bird of birds) {
    savedBirds.push(bird);
  }
  birds = [];
  birds[0] = new Bird(new NeuralNetwork(birdBrain));
}

function retrainBestBird() {
  isNotTraining = true;
  nextGenerationFromJson();
}