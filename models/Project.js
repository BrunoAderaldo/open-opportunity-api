const ObjectId = require('mongodb').ObjectID;

class Project {
  constructor({ category, name, description }) {
    this._id         = new ObjectId();
    this.createdAt   = new Date();
    this.category    = category;
    this.name        = name;
    this.description = description;
  }
}

module.exports = Project;
