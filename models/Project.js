const ObjectId = require('mongodb').ObjectID;

class Project {
  constructor({ name, description }) {
    this._id = new ObjectId();
    this.name = name;
    this.description = description;
  }
}

module.exports = Project;
