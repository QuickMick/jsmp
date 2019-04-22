const CANNON = require("cannon");
const COM = require("./../common/com");
const Statics = require("./../common/statics");


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
      position: new CANNON.Vec3(1, 1, 10), // m
      shape: new CANNON.Sphere(Statics.PLAYER_RADIUS),
      material: context.material.slippery,
    });

    // connect the player to the entity
    this.body.entity = this;

    /**
     * contains all listeners, that are registered for this socket
     */
    this.socketListeners = [];

    this.on(COM.MSG.TEEOFF, (data) => this.teeOff(data));
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
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      position: this.body.position,
      quaternion: this.body.quaternion
    };
  }

  getPosition() {
    return this.body.position;
  }

  getQuaternion() {
    return this.body.quaternion;
  }

  teeOff(data) {
    if (!data.vector) return;
    console.log("tee", data);
    this.body.velocity.x += data.vector.x || 0;
    this.body.velocity.y += data.vector.y || 0;
  }
}

module.exports = Player;