class Entity {
  constructor(id, data) {
    /*
     * the id of the entity,
     * it can be named or generated (timebased)
     */
    this.id = id;
    this.data = data || {};
    this.initialized = false;
  }

  /**
   * override this to initialize the element.
   * the supermethod must be called AT THE END of the inherited init-metehod
   *
   * @param {Context} context
   * @memberof Entity
   */
  init(context) {
    this.initialized = true;
    this.mesh.name = this.id;
    this.mesh.entity = this;
  }

  get mesh() {
    throw new Error("abstract");
  }

  get position() {
    return this.body.mesh.position;
  }

  update(context) {

  }

  render(context) {
    if (this.data.position) {
      this.mesh.position.copy(this.data.position);
    }

    if (this.data.quaternion) {
      this.mesh.quaternion.copy(this.data.quaternion);
    }
  }
}

module.exports = Entity;