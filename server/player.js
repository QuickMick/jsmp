const objectid = require('objectid');
const CANNON = require("cannon");

const RADIUS = 10;

class Player {
  constructor(socket) {
    super()

    this.socket = socket;
    this.id = objectid();
    this.name = objectid();

    this.body = new CANNON.Body({
      mass: 5, // kg
      position: new CANNON.Vec3(0, 0, 10), // m
      shape: new CANNON.Sphere(RADIUS)
    });

    // connect the player to the entity
    this.body.entity = this;

    /**
     * contains all listeners, that are registered for this socket
     */
    this.socketListeners = [];
  }

  on(event, callback) {
    this.socketListeners.push({
      event,
      callback
    });
    this.socket.on(event, callback);
  }

  tearDown() {
    for (let cur of this.socketListeners) {
      this.socket.removeListener(cur.event, cur.callback);
    }
  }

  toJSON() {
    return JSON.stringify({
      id: this.id,
      name: this.name
    });
  }
}

module.exports = Player;