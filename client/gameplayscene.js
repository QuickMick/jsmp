const BaseScene = require('./basescene');
const COM = require("./../common/com");

//const KEY_MAPPING = require('./../config/keymapping.json');
//var ColladaLoader = require('three-collada-loader-2');

const EntityManager = require('./entitymanager');
const MATERIAL = require('./../content/materials.json');
const Map = require("./map");
const Player = require("./player");



class GameplayScene extends BaseScene {
  constructor(socket) {
    super();
    this.socket = socket;

    this._camera = null;

    this.entityManager = new EntityManager(this.stage, {
      material: MATERIAL
    });

    /**
     * will be filled, when the init message comes
     */
    this.player = null;

    /**
     * maps id to player
     */

    this.players = {};

    /**
     * will  be filled, when the change_map message comes
     */
    this.map = null;

  }

  init(context) {
    this.entityManager.init(context);

    this._camera = new THREE.PerspectiveCamera(75, context.width / context.height, 0.1, 1000);
    this._camera.position.z = 10;

    const pointLight = new THREE.PointLight(0xFFFFFF, 1, 25);
    pointLight.position.x = 0;
    pointLight.position.y = 0;
    pointLight.position.z = 15;

    this.stage.add(pointLight);
    super.init(context);

    this.socket.on(COM.MSG.INIT, (evt) => {
      console.log(evt);

      for (let id in evt.players) {
        const cur = evt.players[id];
        const player = new Player(cur);
        // find the player object and save it for easier access
        if (id == evt.you) {
          this.player = player;
        }
        // fill the references
        this.addPlayer(context, player);
      }
    });

    this.socket.on(COM.MSG.CLIENT_CONNECTED, (evt) => {
      this.addPlayer(context, evt.player);

    });

    this.socket.on(COM.MSG.CLIENT_DISCONNECTED, (evt) => {
      this.removePlayer(context, evt.id);
    });

    this.socket.on(COM.MSG.POSITION_UPDATE, (evt) => {
      for (let id in evt) {
        const update = evt[id];
        this.updatePlayer(context, id, update);
      }
    });

    this.socket.on(COM.MSG.CHANGE_MAP, (evt) => {
      const map = new Map();
      map.init(context, evt);
      this.stage.add(map.mesh);
    });

    setTimeout(() => {
      this.socket.emit(COM.MSG.TEEOFF, {
        vector: {
          x: 1,
          y: 1
        }
      });

    }, 1000);
  }

  updatePlayer(context, id, update) {
    const player = this.players[id];
    if (update.position) {
      player.mesh.position.copy(update.position);
    }

    if (update.quaternion) {
      player.mesh.quaternion.copy(update.quaternion);
    }
  }

  addPlayer(context, player) {
    const id = player.id;
    this.players[id] = player;
    this.entityManager.addEntity(context, player);
  }

  removePlayer(context, id) {
    const player = this.players[id];
    this.entityManager.removeEntity(context, player);
    delete this.players[id];
  }

  update(context) {
    this.entityManager.update(context);
  }

  render(context) {
    this.entityManager.render(context);
  }

  tearDown(context) {

  }
}

module.exports = GameplayScene;