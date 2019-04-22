const CANNON = require("cannon");

const RADIUS = 10;

/**
 * The player represents the dataset of a connected player.
 * It contains all Metadata like the name, id, color, etc.
 * but also the processable objects, like the physics body.
 *
 * @class Player
 */
class Player {
  constructor(context, socket, options) {
    this.socket = socket;
    /**
     * player details
     */
    this.id = options.id;
    this.name = options.name;
    this.color = options.color;

    /**
     * the physics body
     */
    this.body = new CANNON.Body({
      mass: 5, // kg
      position: new CANNON.Vec3(0, 0, 10), // m
      shape: new CANNON.Sphere(RADIUS),
      material: context.material.slippery,
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

  /**
   * converts the player object
   * to a sendable object,
   * that can be transfered to the clients via socket.io
   *
   * @returns
   * @memberof Player
   */
  toJSON() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      color: this.color
    });
  }
}

module.exports = Player;