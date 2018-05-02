const ObjectId = require('mongodb').ObjectID;

class User {
  constructor({ email, password }) {
    this._id       = new ObjectId();
    this.createdAt = new Date();
    this.email     = email;
    this.password  = password;
    this.confirmed = false;
  }
}

module.exports = User;
