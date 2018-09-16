const ObjectId = require('mongodb').ObjectID;

class Project {
  constructor({ name, description, skills, userId }) {
    this._id         = new ObjectId();
    this.name        = name;
    this.description = description;
    this.skills      = skills;
    this.userId      = userId;
    this.createdAt   = new Date();
  }
}

module.exports = Project;
