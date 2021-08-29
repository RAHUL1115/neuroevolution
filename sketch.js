const total = 255;
let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;
let slider;
let birdBrain;
let bestLiveBirdBrain;
let isTraining = true;
let highScore = 0;

function preload(){
  birdBrain = loadJSON('best_bird.json');
}

function setup() {
  createCanvas(400, 600);
  slider = createSlider(1,20,1)
  for (let i = 0; i < total; i++) {
    birds[i] = new Bird();
  }
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
  background(0);
  
  for (let bird of birds) {
    bird.show();
  }
  
  for (let pipe of pipes) {
    pipe.show();
  }
  if (birds[0].score>highScore){
    highScore = birds[0].score;
    bestLiveBirdBrain = birds[0].brain;
  }
  document.getElementById('score').innerHTML = "score :" + birds[0].score;
  document.getElementById('heighscore').innerHTML = "Heigh Score :" + highScore;
}

function keyPressed(){
  if (key == 'S' || key == 's') {
    let b = birds[0];
    let j = b.brain.serialize();
    saveJSON(j, 'bird.json');
  }
  if (key == 'B' || key == 'b') {
    let j = bestLiveBirdBrain.serialize();
    saveJSON(j, 'best_bird.json');
  }
  if (key == 'L' || key == 'l') {
    isNotTraining = false;
    for (const bird of birds) {
      savedBirds.push(bird);
    }
    birds = [];
    birds[0] = new Bird(new NeuralNetwork(birdBrain));
  }
  if (key == 'r' || key == 'R') {
    isNotTraining = true;
    nextGenerationFromJson();
  }
}