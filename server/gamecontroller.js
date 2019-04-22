const PlayerController = require("./playercontroller");
const Game = require("./game");
const Statics = require("./../common/statics");

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

    this.playerController = new PlayerController(io, this.game);
    this.playerController.start(context);
    // Add the WebSocket handlers
    this.playerController.on(PlayerController.CONNECT, (e) => this.game.addEntity(e.player.body));
    this.playerController.on(PlayerController.TEEOFF, (e) => this.game.teeOff(e));
    this.playerController.on(PlayerController.DISCONNECT, (e) => this.game.removeEntity(e.player.body));

    this.run();
  }

  run() {
    let lastTime = Date.now();
    this.runIntervalID = setInterval(() => {
      const time = Date.now();
      const delta = (time - lastTime) / 1000;
      this.update(delta);
      lastTime = time;
    }, Statics.TICKS);
  }

  update(delta) {
    this.game.update(delta);
    this.playerController.update(delta);
  }
}
module.exports = GameController;