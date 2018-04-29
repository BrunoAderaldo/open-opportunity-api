const ObjectId = require('mongodb').ObjectID;

class Project {
  constructor({ projectCategory, projectName, projectDescription }) {
    this._id = new ObjectId();
    this.createdAt = new Date();
    this.projectCategory = projectCategory;
    this.projectName = projectName;
    this.projectDescription = projectDescription;
  }
}

module.exports = Project;
