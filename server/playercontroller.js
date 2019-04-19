const Events = require("events");
const Player = require("./player");


class PlayerController extends Events {
  constructor(io) {
    super();
    this.io = io;

    /**
     * maps playerIds to players
     */
    this.players = {
      //id:playerobj
    };

    this.io.on('connection', this.onConnect.bind(this));
  }

  onConnect(socket) {
    // create the player on connection
    const player = new Player(socket);
    this.players[player.id] = player;
    // register the player events
    socket.on("disconnect", this._onDisconnect.bind(this, player));
    // emit the initial data
    socket.emit("init", {
      you: player.id,
      players: this.players
    });

    this.emit("connect", player);
  }

  _initPlayerEvents(player) {
    player.on("teeoff", e => this.emit("teeoff", {
      player,
      direction: e.direction,
      modifier: e.modifier
    }));
  }

  _onDisconnect(player) {
    delete this.players[player.id];
    this.emit("disconnect", {
      player
    });

    player.tearDown();
  }
}

module.exports = PlayerController;