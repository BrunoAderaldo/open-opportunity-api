const ObjectId = require('mongodb').ObjectID;

class User {
  constructor({ name, email, password }) {
    this._id       = new ObjectId();
    this.name      = name;
    this.email     = email;
    this.password  = password;
    this.createdAt = new Date();
  }
}

module.exports = User;
