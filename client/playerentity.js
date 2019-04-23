const THREE = require('three');
const Entity = require('./entity');
const Statics = require("../common/statics");

class Player extends Entity {
  constructor(data) {
    super(data.id);
    this.data = data;
  }

  init(context) {
    const sphere_geometry = new THREE.SphereGeometry(Statics.PLAYER_RADIUS, 16, 16);
    this._mesh = new THREE.Mesh(
      sphere_geometry,
      new THREE.MeshLambertMaterial({
        color: 0x00ff00
      })
    );

    this._mesh.player = this;

    this._mesh.position.set(0, 0, 0.1);

    super.init(context);
  }

  get mesh() {
    return this._mesh;
  }




  update(context) {

  }

  postStep() {

  }

  render(context) {
    super.render(context);
  }
}

module.exports = Player;