/**
 * Created by Mick on 18.12.2016.
 */

const Events = require('events');
const InputAction = require('./inputaction');

const MOUSEMOVE = "mousemove";
const RAW_MOUSEMOVE = "rawmousemove";
const MOUSEWHEEL = "mousewheel";

class InputManager extends Events {
  constructor(targetCanvas) {
    super();
    this.targetCanvas = targetCanvas;

    // contains every keys, which are pressed since the last update cycle
    this.keyState = {
      keyboard_keys: {},
      mouse_buttons: {}
    };

    // contains the mouse position
    this.mouse = {
      lastX: 0,
      lastY: 0,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0
    };

    this.mapping = null;

    this._init();
  }


  _init() {
    //add key listeners
    // TODO: nichtmehr auf window lassen
    document.addEventListener("keydown", this._keyDown.bind(this), false);
    document.addEventListener("keyup", this._keyUp.bind(this), false);

    document.addEventListener("mousewheel", this._mouseWheelMove.bind(this), false);
    document.addEventListener("mousedown", this._mouseDown.bind(this), true);
    document.addEventListener("mouseup", this._mouseUp.bind(this), true);
    document.addEventListener("touchstart", this._mouseDown.bind(this), false);
    document.addEventListener("touchend", this._mouseUp.bind(this), false);

    // mouse move
    this.targetCanvas.addEventListener('mousemove', this._onMouseMove.bind(this), false);
    this.targetCanvas.addEventListener('touchmove', this._onMouseMove.bind(this), false);
  }

  /**
   * loads a keymapping from json, in expected format:
   *   "KEY_MAPPING":{
   *      "TURN":{"keyboard":[70],"mouse":[]},
   *      "MOUSE_LEFT":{"keyboard":[],"mouse":[0]}
   *    },
   * @param KEY_MAPPING
   */
  loadMapping(KEY_MAPPING) {
    // clean the old mapping, if existing
    this.resetMapping();
    // load all keys located in config.json
    const keyMapping = {};
    for (let key in KEY_MAPPING) {
      const cur = KEY_MAPPING[key];
      keyMapping[key] = new InputAction(key, cur.keyboard, cur.mouse);
    }
    this.setMapping(keyMapping);
  }

  _mouseWheelMove(evt) {
    this.emit(MOUSEWHEEL, {
      delta: evt.deltaY
    });
  }

  resetMapping() {
    this.keyState = {
      keyboard_keys: {},
      mouse_buttons: {}
    };

    // contains the mouse position
    this.mouse = {
      lastX: 0,
      lastY: 0,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0
    };
    this.mapping = null;
  }

  setMapping(mapping) {
    this.mapping = mapping;
  }

  _keyDown(event) {
    this.keyState.keyboard_keys[event.keyCode] = true;
    //     event.preventDefault();
    this._processKeyInteraction();
  }

  _keyUp(event) {
    if (this.keyState.keyboard_keys.hasOwnProperty(event.keyCode)) {
      delete this.keyState.keyboard_keys[event.keyCode];
    }
    //   event.preventDefault();
    this._processKeyInteraction();
  }

  _mouseDown(event) {

    var btn = this._normalizeMouseKeyCode(event);
    if (btn < 0) return; // unknown input

    this.keyState.mouse_buttons[btn] = true;
    //  event.preventDefault();
    this._processKeyInteraction();
  }

  _mouseUp(event) {
    var btn = this._normalizeMouseKeyCode(event);
    if (btn < 0) return; // unknown input

    if (this.keyState.mouse_buttons.hasOwnProperty(btn)) {
      delete this.keyState.mouse_buttons[btn];
    }
    this._processKeyInteraction();
    //   event.preventDefault();
  }

  /**
   * takes different mouseup/down event and returns the keycode
   * @param event
   * @returns {*}
   * @private
   */
  _normalizeMouseKeyCode(event) {
    if (event.button || event.button == 0) {
      return event.button;
    } else if (event.changedTouches && event.changedTouches.length > 0) {
      return 0;
    } else if (event.data && (event.data.button || event.data.button != 0)) {
      return event.data.button;
    }
    return -1;
  }

  _processKeyInteraction() {
    //return, if there is no mapping available
    if (!this.mapping) return;

    //update every key in the mapping
    for (let key in this.mapping) {
      if (!this.mapping.hasOwnProperty(key)) continue;
      this.mapping[key].update(this.keyState);
    }
  }


  endCycle() {
    for (let key in this.mapping) {
      if (!this.mapping.hasOwnProperty(key)) continue;
      this.mapping[key].endCycle();
    }
  }

  _onMouseMove(event) {
    this.mouse.lastX = this.mouse.x;
    this.mouse.lastY = this.mouse.y;

    const size = this.targetCanvas.getBoundingClientRect();
    this.mouse.x = (event.clientX / size.width) * 2 - 1;
    this.mouse.y = -(event.clientY / size.height) * 2 + 1;

    // set the delta mouse movement
    this.mouse.dx = this.mouse.x - this.mouse.lastX;
    this.mouse.dy = this.mouse.y - this.mouse.lastY;

    if (this.mouse.dx != 0 || this.mouse.dy != 0) {
      this.emit(MOUSEMOVE, this.mouse);
      this.emit(RAW_MOUSEMOVE, event);
    }
  }
}

module.exports = InputManager;