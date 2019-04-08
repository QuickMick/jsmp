const objectid = require('objectid');
const CANNON = require("cannon");

class Player extends CANNON.Body {
  constructor(socket) {
    super({
      mass: 5, // kg
      position: new CANNON.Vec3(0, 0, 10), // m
      shape: new CANNON.Sphere(radius)
    });

    this.socket = socket;
    this.id = objectid();
    this.name = objectid();

    this.body.player = this
  }

  toString() {
    return JSON.stringify({
      id: this.id,
      name: this.name
    });
  }
}

module.exports = Player;