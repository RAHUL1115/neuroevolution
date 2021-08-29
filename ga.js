function nextGeneration(){
  console.log("next generation")
  calculateFitness();
  for (let i = 0; i < total; i++) {
    birds[i] = pickOne();
  }
  savedBirds = [];
}

function nextGenerationFromJson() {
  for (let i = 0; i < total; i++) {
    birds[i] = new Bird(new NeuralNetwork(birdBrain));
    birds[i].mutate();
  }
  savedBirds = [];
}

function pickOne() {
  let index = 0;
  let r = random(1);

  while (r>0) {
    r = r - savedBirds[index].fitness;
    index++;
  }
  index--;

  let bird = savedBirds[index];
  let child = new Bird(bird.brain);
  child.mutate();
  return child;
}

function calculateFitness(){
  let sum = 0;
  for (const bird of savedBirds) {
    sum += bird.score;
  } 
  for (const bird of savedBirds) {
    bird.fitness = bird.score / sum;
  }
}