const THREE = require('three');


class BaseScene {
  constructor() {
    this.isInitialized = false;
    this._camera = null;

    this.stage = new THREE.Scene();


    //The X axis is red. The Y axis is green. The Z axis is blue.
    const axisHelper = new THREE.AxisHelper(5);
    //  this.stage.add(axisHelper);
  }

  get camera() {
    return this._camera;
  }

  init(context) {
    this.isInitialized = true;
  }

  resume(context) {

  }

  update(context) {
    throw new Error("abstract");
  }

  render(context) {
    throw new Error("abstract");
  }

  pause(context) {

  }

  cleanUp(context) {}
}

module.exports = BaseScene;