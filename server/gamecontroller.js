const PlayerController = require("./playercontroller");
const Game = require("./game");

/*
setInterval(function () {
  io.sockets.emit('message', 'hi!');
}, 1000);*/


class GameController {
  constructor(io) {
    this.game = new Game();
    this.playerController = new PlayerController(io);
    // Add the WebSocket handlers
    this.playerController.on("connect", (e) => this.game.addEntity(e.player.body));
    this.playerController.on("teeoff", (e) => this.game.teeOff(e));
  }

}

module.exports = GameController;