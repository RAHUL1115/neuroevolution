function nextGeneration(){
  console.log("next generation")
  calculateFitness();
  for (let i = 0; i < total; i++) {
    birds[i] = pickOne();
  }
  savedBirds = [];
  generation++;
}

function nextGenerationFromJson() {
  for (let i = 0; i < total; i++) {
    birds[i] = new Bird(new NeuralNetwork(birdBrain));
    birds[i].brain.mutate(0.001);
  }
  savedBirds = [];
}

function pickOne() {
  let partners = [];
  let child;
  let e = 0

  for (let i = 0; i < 2; i++) {
    let index = 0;
    let r = NeuralNetwork.randomfloat(0.8 , 1);

    while (r > 0) {
        r = r - savedBirds[index].fitness;
      index++;
    }
    index--; 

    partners[i] = savedBirds[index].brain.copy();
    // partners[i] = savedBirds[savedBirds.length - (i + 1)].brain.copy();
    // partners[i] = savedBirds[i].brain.copy();
  }

  // child = partners[0];
  child = NeuralNetwork.crossOver(partners[0], partners[1], crossOverRate);
  child.mutate(mutationRate);
  child = new Bird(child);

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