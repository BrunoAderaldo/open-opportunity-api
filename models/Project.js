const ObjectId = require('mongodb').ObjectID;

class Project {
  constructor({ name, description, skills, userID }) {
    this._id         = new ObjectId();
    this.name        = name;
    this.description = description;
    this.skills      = skills;
    this.userID      = userID;
    this.createdAt   = new Date();
  }
}

module.exports = Project;
