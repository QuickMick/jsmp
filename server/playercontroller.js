const Events = require("events");
const Player = require("./player");


class PlayerController extends Events {
  constructor() {
    super();
    /**
     * maps playerIds to players
     */
    this.players = {
      //id:playerobj
    };
  }

  onConnect(socket) {
    // create the player on connection
    const player = new Player(socket);
    this.players[player.id] = player;
    // register the player events
    socket.on("disconnect", this.onDisconnect.bind(this, player));
    // emit the initial data
    socket.emit("init", {
      you: player.id,
      players: this.players
    });

    this.emit("connect", player);
  }

  _initPlayerEvents(socket) {
    socket.on("teeoff", (e) => {
      this.emit
    });
  }
  _teardownPlayerEvents() {

  }

  onDisconnect(player) {
    delete this.players[player.id];
    this.emit("disconnect", {
      player
    });
  }
}

module.exports = PlayerController;