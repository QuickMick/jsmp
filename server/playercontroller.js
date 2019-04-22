const Events = require("events");
const Player = require("./player");
const generateName = require('sillyname');
const objectid = require('objectid');
const randomColor = require('random-color');
const COM = require("./../common/com");

/**
 * The PlayerController handles all client connections,
 * it monitors the connect/disconnect and all message transfers.
 *
 * @class PlayerController
 * @extends {Events}
 */
class PlayerController extends Events {
  constructor(io, game) {
    super();
    this.game = game;
    this.io = io;

    /**
     * maps playerIds to players
     * instance of Player
     */
    this.players = {
      //id:playerobj
    };

    /**
     * contains all colors, taken by players
     */
    this.takenColors = new Set();
  }

  start(context) {
    this.context = context;

    this.io.on('connection', this.onConnect.bind(this, context));
  }

  /**
   * sends updates to the clients
   *
   * @memberof PlayerController
   */
  update(delta) {
    // create possition update message
    // it will look like { playerID : positionVector }
    const result = {};
    for (let id in this.players) {
      const player = this.players[id];
      result[id] = {
        position: player.getPosition(),
        quaternion: player.getQuaternion()
      };
    }
    // send it to the server.
    this._broadcast(COM.MSG.POSITION_UPDATE, result);
  }

  /**
   * randomg generates a unique color
   *
   * @returns a unique color,  that can be used for a player
   * @memberof PlayerController
   */
  _findColor() {
    let color = null;
    do {
      // generate colors, till we found a unique one
      color = randomColor().hexString();
    } while (this.takenColors.has(color));
    this.takenColors.add(color);
    return color;
  }

  /**
   * Eventhandler, that is called, when a client connects.
   * registered in start and applied to the io object
   *
   * @param {Object} context
   * @param {Socket} socket
   * @memberof PlayerController
   */
  onConnect(context, socket) {
    // create the player on connection
    const player = new Player(context, socket, {
      id: objectid(),
      name: generateName(),
      color: this._findColor()
    });

    this.players[player.id] = player;
    // register the player events
    socket.on("disconnect", this._onDisconnect.bind(this, player));
    // emit the initial data
    this._sendToClient(socket, COM.MSG.INIT, {
      you: player.id,
      players: this.players
    });
    // send all other clients, that this one has connected
    this._broadcastExceptSender(socket, COM.MSG.CLIENT_CONNECTED, {
      player
    });
    // notify the instance, that there is a connection
    this.emit(PlayerController.CONNECT, {
      player
    });

    this._sendToClient(socket, COM.MSG.CHANGE_MAP, this.game.getCurrentMap());
  }

  /**
   * Eventhanlder, that is called, when a player disconnects,
   * it is regiestered in the onConnect funciton
   *
   * @param {*} player
   * @memberof PlayerController
   */
  _onDisconnect(player) {
    // remove the player
    delete this.players[player.id];
    // free its color
    this.takenColors.delete(player.color);
    // notify the system, about that the player left
    this.emit(PlayerController.DISCONNECT, {
      player
    });

    // notify all other players that one left
    this._broadcastExceptSender(player.socket, COM.MSG.CLIENT_DISCONNECTED, {
      id: player.id
    });
    // teardown the player
    player.tearDown();
  }

  /**
   * sends a message to ALL clients
   * @param {String} evt the message name, e.g "connect", "init",etc.
   * @param {Object} msg the message as object
   */
  _broadcast(evt, msg) {
    this.io.emit(evt, msg);
  }

  /**
   * Sends a message to all clients, EXCEPT one client
   * @param {Socket} senderSocket 
   * @param {String} evt the message name, e.g "connect", "init",etc.
   * @param {String} msg the message as object
   */
  _broadcastExceptSender(senderSocket, evt, msg) {
    senderSocket.broadcast.emit(evt, msg);
  }

  /**
   * sends a message to just one client
   *
   * @param {Socket} clientConnectionSocket
   * @param {String} evt the message name, e.g "connect", "init",etc.
   * @param {String} msg the message as object
   * @memberof PlayerController
   */
  _sendToClient(clientConnectionSocket, evt, msg) {
    clientConnectionSocket.emit(evt, msg);
  }
}

PlayerController.CONNECT = "connect";
PlayerController.DISCONNECT = "disconnect";
PlayerController.TEEOFF = "teeoff";

module.exports = PlayerController;