const THREE = require('three');
const Stats = require('stats.js');

const InputManager = require("./inputmanager");

const OFFSET = 0;

class ClientGame {
  constructor() {
    this.quit = false;
    this.fps = 60;
    this.then = Date.now();

    this.renderer = null;


    // necessary for the context object
    const self = this;
    /**
     * object passed to all render and update-calls
     */
    this.context = {
      delta: 1,
      get camera() {
        if (!self.currentScene) return null;
        return self.currentScene.camera;
      },
      get fixedFrameTime() {
        return 1000 / self.fps
      },
      get fixedTimeStep() {
        return 1 / self.fps
      },
      inputManager: null,
      assets: {}
    };

    /**
     * field to hold the next job for scene cahgnes
     */
    this._changeSceneJob = null;
  }


  start(target) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.classList = "scene";
    this.context.inputManager = new InputManager(this.renderer.domElement);
    // prevent the context menu
    this.renderer.domElement.oncontextmenu = function (e) {
      e.preventDefault();
    };
    // add it to the document
    target.appendChild(this.renderer.domElement);

    // add the resize listene and call it,
    // so that the screen is initially sized correctly
    this.resize(target);
    window.addEventListener('resize', this.resize.bind(this, target), false);

    // add debug stats
    let stats = null;
    if (window.DEBUG) {
      stats = new Stats(); // <-- remove me
      document.body.appendChild(stats.dom); // <-- remove me
    }
    // const clock = new THREE.Clock();
    // this.context.delta = clock.getDelta();

    /*
     * the main application cycle
     */
    const run = () => {
      if (this.quit) return;
      requestAnimationFrame(run);

      // change the scene if necessary
      if (this._changeSceneJob) {
        this._changeSceneJob(this.context);
        this._changeSceneJob = null;
      }
      // calculate the delta time
      const now = Date.now();
      const delta = now - this.then;
      const interval = this.context.fixedFrameTime;
      // update the scene and redner if possible
      if (delta > interval) {
        this.context.delta = delta / 1000; // update the delta in the context 
        this.update(this.context);
        this.then = now - (delta % interval);
        this.render(this.context);
      }
      if (stats) {
        stats.update();
      }
    };
    // start the update cycle
    run();
  }


  /**
   * updates the current scene
   *
   * @param {*} delta
   * @memberof Game
   */
  update(context) {
    if (!this.currentScene || !this.currentScene.isInitialized) return;
    this.currentScene.update(context);
    this.context.inputManager.endCycle();
  }

  /**
   * renders the current scene
   *
   * @param {*} delta
   * @memberof Game
   */
  render(context) {
    if (!this.currentScene || !this.currentScene.isInitialized) return;
    this.currentScene.render(context);
    const camera = this.context.camera;
    if (!camera) return console.error("no cam");
    this.renderer.render(this.currentScene.stage, camera);
  }

  /**
   * resizes the canvas
   * use either event or the widht/hgiht
   * @param {Object} evt evt from the window event
   * @param {Number} width of the canvas
   * @param {Number} height of the canvas
   * @memberof Game
   */
  resize(target, evt) {
    const size = target.getBoundingClientRect();
    const w = size.width;
    const h = size.height;
    this.context.width = w;
    this.context.height = h;

    const camera = this.context.camera;
    if (camera) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    this.renderer.setSize(w, h);
  }

  /**
   * starts a new scene.
   * it is sheduled before the next game-cycle
   *
   * @param {BaseScene} scene
   * @memberof Game
   */
  setScene(scene) {
    this._changeSceneJob = (context) => {
      // if there is a old scene, stop it and clean it up
      if (this.currentScene) {
        this.currentScene.pause(context);
        this.currentScene.tearDown(context);
      }
      // then start the new scene
      if (!scene.isInitialized) {
        scene.init(context);
      }

      this.currentScene = scene;
      scene.resume(context);
    }
  }

}

module.exports = ClientGame;