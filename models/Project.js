const ObjectId = require('mongodb').ObjectID;

class Project {
  constructor({ category, name, description, userID }) {
    this._id         = new ObjectId();
    this.createdAt   = new Date();
    this.category    = category;
    this.name        = name;
    this.description = description;
    this.userID      = userID;
  }
}

module.exports = Project;
