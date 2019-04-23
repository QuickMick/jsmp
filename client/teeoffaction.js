const THREE = require('three');
const Action = require("./action");
const Statics = require("./../common/statics");


const mouseVector = new THREE.Vector2();
const vec = new THREE.Vector3(); // create once and reuse

class TeeOffAction extends Action {
  constructor(stage, player) {
    super();
    this.stage = stage;
    this.selectedElement = null;


    /**
     * mouse intersection handler
     */
    this.raycaster = null;


    /**
     * blocks all other actions and stuff, if this is true
     */
    this.isBusy = false;

    this.line = null;

    this.start = new THREE.Vector3(0, 0, 0);
    this.end = new THREE.Vector3(0, 0, 0);
  }

  init(context) {


    const material = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });


    const geometry = new THREE.Geometry();
    geometry.vertices.push(this.start);
    geometry.vertices.push(this.end);

    this.line = new THREE.Line(geometry, material);
    this.line.renderOrder = 10000; // this draws over everything

    this.raycaster = new THREE.Raycaster();
    super.init(context);
  }

  update(context) {
    mouseVector.x = context.inputManager.mouse.x;
    mouseVector.y = context.inputManager.mouse.y;


    this.raycaster.setFromCamera(mouseVector, context.camera);
    var intersects = this.raycaster.intersectObjects(this.stage.children);

    /*
     * check what is selected
     */
    if (intersects.length > 0) {
      if (this.selectedElement != intersects[0].object && intersects[0].object.player) {
        if (this.selectedElement) {
          this.selectedElement.material.emissive.setHex(this.selectedElement.currentHex);
        }
        this.selectedElement = intersects[0].object;
        this.selectedElement.currentHex = this.selectedElement.material.emissive.getHex();
        this.selectedElement.material.emissive.setHex(0xff0000);
      }
    } else {
      if (this.selectedElement) {
        this.selectedElement.material.emissive.setHex(this.selectedElement.currentHex);
      }
      this.selectedElement = null;
    }

    if (this.selectedElement) {
      this.start.x = this.selectedElement.position.x;
      this.start.y = this.selectedElement.position.y;
      this.line.position.z = this.selectedElement.position.z + Statics.PLAYER_RADIUS / 2;
    }

    // this.end.x = context.inputManager.mouse.x;
    // this.end.y = context.inputManager.mouse.y;

    /*
        vec.set(
          context.inputManager.mouse.x,
          context.inputManager.mouse.y,
          0.5);

        vec.unproject(context.camera);
        vec.sub(context.camera.position).normalize();
        var distance = (0.5 - context.camera.position.z) / vec.z; //-context.camera.position.z / vec.z;
        this.end.copy(context.camera.position).add(vec.multiplyScalar(distance));

    */

    var planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    var pos = this.raycaster.ray.intersectPlane(planeZ);
    console.log("x: " + pos.x + ", y: " + pos.y + " z: " + pos.z);

    this.end.copy(pos);

    this.end.z = 0;
    this.start.z = 0;
    this.line.position.z = 0;
    this.line.position.x = 0;
    this.line.position.y = 0;

    //  MP.Compute(context.inputManager.mouse.x, context.inputManager.mouse.y, context.camera, this.end);
    this.line.geometry.verticesNeedUpdate = true;
    /*
     * check if action shall be executed
     */
    const m = context.inputManager.mapping;
    if (this.selectedElement && m.USE.wasPressed) {
      this.stage.add(this.line);
      this.isBusy = true;
    }

    if (this.selectedElement && m.USE.wasReleased) {
      this.isBusy = false;
      this.stage.remove(this.line);
      this.emit(TeeOffAction.TEEOFF, {
        vector: {
          x: 1,
          y: 1
        }
      });
    }
  }
}

TeeOffAction.TEEOFF = "TEEOFF";

module.exports = TeeOffAction;