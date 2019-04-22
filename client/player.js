const THREE = require('three');
const Entity = require('./entity');

class Player extends Entity {
  constructor(data) {
    super(data.id);
    this.data = data;
  }

  init(context) {
    const radius = 1;
    const sphere_geometry = new THREE.SphereGeometry(radius, 8, 8);
    this._mesh = new THREE.Mesh(
      sphere_geometry,
      new THREE.MeshLambertMaterial({
        color: 0x00ff00
      })
    );

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