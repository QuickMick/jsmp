const CANNON = require("cannon");
const MATERIALS = require("./../content/materials.json");
const Statics = require("./../common/statics");
const MAX_SUB_STEPS = 3;


/**
 * creates the materials and adds them to the world
 *
 * @param {World} world the physics world
 * @param {Object} materials the materials object, containing all materials and conctacts
 * @returns {Object} an object containing all materials
 */
function applyMaterials(world, materials) {
  const result = {};
  for (let mat of materials.materials) {
    const k = Object.keys(mat).length;

    result[mat.name] = new CANNON.Material(k > 1 ? mat : mat.name);
  }

  for (let m of materials.contacts) {
    const contactMaterial = new CANNON.ContactMaterial(
      result[m.between[0]],
      result[m.between[1]],
      m.behaviour
    );
    world.addContactMaterial(contactMaterial);
  }
  return result;
}


class Game {
  constructor() {

    /**
     * contains the game physics engine
     */
    this.world = null;

    /**
     * contains the materials after initialization
     */
    this.materials = null;

    /**
     * the id for the interval, that handles the game-logic
     */
    this.runIntervalID = null;
  }

  /**
   * starts the game logic and initializes the game
   *
   * @memberof Game
   */
  start(context) {

    // init the world
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, -9.82); // m/s²

    // add a ground shape
    const groundBody = new CANNON.Body({
      mass: 0 // mass == 0 makes the body static
    });
    groundBody.addShape(new CANNON.Plane());
    groundBody.position.z = 0;
    this.world.addBody(groundBody);

    /**
     * Load the materials
     */
    this.materials = applyMaterials(this.world, MATERIALS);
    context.material = this.materials;
    //TODO: load map

    console.log("running server");
    // Start the simulation loop

    /*
        this.world.addEventListener("beginContact", (evt) => {
          const a = evt.bodyA.entity.onBeginContact;
          const b = evt.bodyB.entity.onBeginContact;
          if (a) a.call(evt.bodyA.entity, context, evt.bodyB);
          if (b) b.call(evt.bodyB.entity, context, evt.bodyA);
        });

        this.world.addEventListener("endContact", (evt) => {
          const a = evt.bodyA.entity.onEndContact;
          const b = evt.bodyB.entity.onEndContact;
          if (a) a.call(evt.bodyA.entity, context, evt.bodyB);
          if (b) b.call(evt.bodyB.entity, context, evt.bodyA);

        });
    */
  }


  update(delta) {
    this.world.step(Statics.TICKS, delta, MAX_SUB_STEPS);
  }


  getCurrentMap() {
    return {
      width: 10,
      height: 10,
      map: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      ]
    };
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
   * @param {Body} entity
   * @memberof Game
   */
  addEntity(entity) {
    this.world.addBody(entity);
  }

  /**
   * removes an added entity
   *
   * @param {Body} entity
   * @memberof Game
   */
  removeEntity(entity) {
    this.world.remove(entity);
  }
}

module.exports = Game;