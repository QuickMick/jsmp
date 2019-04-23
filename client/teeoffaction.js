const Action = require("./action");

const mouseVector = new THREE.Vector2();
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
    }

    this.end.x = context.inputManager.mouse.x * 10;
    this.end.y = context.inputManager.mouse.y * 10;

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