const PlayerController = require("./playercontroller");
const Game = require("./game");

/*
setInterval(function () {
  io.sockets.emit('message', 'hi!');
}, 1000);*/


class GameController {
  constructor(io) {
    this.game = new Game();
    this.playerController = new PlayerController();
    // Add the WebSocket handlers
    io.on('connection', this.playerController.onConnect.bind(this.playerController));
    this.playerController.on("connect", (e) => this.game.addEntity(e.player));
  }

}

module.exports = GameController;