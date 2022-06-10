class Bird {
  constructor(brain) {
    this.y = height / 2;
    this.x = 50;
    this.gravity = 0.6;
    this.lift = -15;
    this.velocity = 0;

    this.score = 0;
    this.fitness = 0;

    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(5, [8], 2);
    }
  }

  show() {
    stroke(255, 160, 65)
    fill(255, 160, 65)
    ellipse(this.x, this.y, 32, 32)
  }

  up() {
    this.velocity += this.lift;
  }

  offscreen() {
    return (this.y > height || this.y < 0);
  }

  think(pipes) {
    let closest = null;
    let closestD = Infinity;
    pipes.forEach((pipe, i) => {
      let d = pipe.x + pipe.w - this.x;
      if (d < closestD && d > 0) {
        closest = pipe;
        closestD = d;
      }
    });

    let input = [];
    input[0] = this.y / height
    input[1] = closest.top / height;
    input[2] = closest.bottom / height;
    input[3] = closest.x / width;
    input[4] = this.velocity / 10;


    let output = this.brain.query(input);
    // if (output.get(0, 0) > output.get(0, 1) && this.velocity >= 0) {
    if (output.get(0, 0) > output.get(0, 1)) {
      this.up()
    }

  }

  update() {
    this.score++;
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;
  }
}