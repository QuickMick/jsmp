const THREE = require('three');
const Statics = require("./../common/statics");

class Map {
  constructor() {


    /**
     * all tiles, mapped to the position e.g.: x_y
     */
    this.meshes = null;

    /**
     * the group contianing all tiles
     */
    this.mesh = null;
  }

  init(context, data) {
    this.data = data;
    this.build(data);
  }

  build(data) {
    var geometry = new THREE.PlaneGeometry(Statics.TILESIZE, Statics.TILESIZE);
    var material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide
    });

    this.meshes = {};
    this.mesh = new THREE.Group();


    for (let y = 0; y < data.height; y++) {
      for (let x = 0; x < data.width; x++) {
        const plane = new THREE.Mesh(geometry, material);

        const tile = data.map[y * x + x];
        // TODO: add the style of the plane

        this.meshes[x + "_" + y] = plane;
        plane.position.set(
          x * Statics.TILESIZE,
          y * Statics.TILESIZE,
          0
        );
        this.mesh.add(plane);
      }
    }
  }
}

module.exports = Map;