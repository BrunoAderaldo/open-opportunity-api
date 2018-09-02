const ObjectId = require('mongodb').ObjectID;

class User {
  constructor({ email, password }) {
    this._id       = new ObjectId();
    this.email     = email;
    this.password  = password;
    this.createdAt = new Date();
  }
}

module.exports = User;
