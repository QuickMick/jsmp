const PlayerController = require("./playercontroller");
const Game = require("./game");

class GameController {
  constructor(io) {
    this.game = new Game();

    /**
     * the context, shared with the game,
     * the player-controller and the players
     */
    const context = {
      material: null // initialized in the game
    };

    this.game.start(context);

    this.playerController = new PlayerController(io);
    this.playerController.start(context);
    // Add the WebSocket handlers
    this.playerController.on(PlayerController.CONNECT, (e) => this.game.addEntity(e.player.body));
    this.playerController.on(PlayerController.TEEOFF, (e) => this.game.teeOff(e));
    this.playerController.on(PlayerController.DISCONNECT, (e) => this.game.removeEntity(e.player.body));

  }
}
module.exports = GameController;