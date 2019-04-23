const Events = require("events");

class Action extends Events {
  constructor() {
    super();
    this.isInitialized = false;
  }


  init(context) {
    this.isInitialized = true;
  }

  update(context) {

  }
}

module.exports = Action;