const CANNON = require("cannon");

const TICKS = 1 / 30;
const MAX_SUB_STEPS = 3;

class Game {
  constructor() {

    // contains the game physics engine
    this.world = null;

    // the id for the interval, that handles the game-logic
    this.runIntervalID = null;
  }

  /**
   * starts the game logic and initializes the game
   *
   * @memberof Game
   */
  start() {

    // init the world
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, -9.82); // m/s²

    // add a ground shape
    const groundBody = new CANNON.Body({
      mass: 0 // mass == 0 makes the body static
    });
    groundBody.addShape(new CANNON.Plane());
    this.world.addBody(groundBody);

    //TODO: load map

    console.log("running server");
    // Start the simulation loop
    let lastTime = Date.now();
    this.runIntervalID = setInterval(() => {
      const delta = (time - lastTime) / 1000;
      world.step(TICKS, delta, MAX_SUB_STEPS);
      lastTime = time;
    }, TICKS);
  }

  /**
   * stops the game logic and clears everything
   */
  shutdown() {
    clearInterval(this.runIntervalID);
  }

  /**
   * adds a entity-body to the game
   *
   * @param {*} entity
   * @memberof Game
   */
  addEntity(entity) {
    this.world.addBody(entity);
  }
}

module.exports = Game;