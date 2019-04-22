class EntityManager {
  constructor(stage, options) {
    this.stage = stage;

    this.entities = new Map();
    this.options = options;

    /*
     * Contains all usable materials
     */
    this.material = {};
  }



  init(context) {

  }

  update(context) {

  }

  render(context) {

  }

  addEntity(context, entity) {
    entity.init(context);
    this.entities.set(entity.id, entity);

    this.stage.add(entity.mesh);
  }

  removeEntity(context, entity) {
    this.stage.remove(entity.mesh);
    this.entities.delete(entity.id);
  }

  /**
   * get an entity by id
   *
   * @param {String} id
   * @returns {Entity} the searched entity
   * @memberof EntityManager
   */
  get(id) {
    return this.entities.get(id);
  }
}

module.exports = EntityManager;