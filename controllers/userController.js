const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const assert = require('assert');
const User = require('../models/User');
const utilsDB = require('../config/db');

function generateToken(params = {}) {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: 86400
  });
}

exports.register = async (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const users = db.collection('users');

  const { email, password } = req.body;

  try {
    if (await users.findOne({ email }))
      return res.status(409).json({ message: 'Email already exists' });

    await bcrypt.hash(password, 10, (err, hash) => {
      if (err)
        return res.status(500).json({ error: err });

      const user = new User({
        email: email,
        password: hash
      });

      users.insertOne(user)
        .then(result => {
          user.password = undefined;

          res.status(201).json({
            message: 'User created',
            created: user,
            token: generateToken({ id: user._id })
          });
        })
        .catch(err => {
          res.status(500).json({ message: `Error: ${err}` });
        });
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

exports.authenticate = async (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const users = db.collection('users');

  const { email, password } = req.body;

  const user = await users.findOne({ email });

  if (!user)
    return res.status(400).json({ error: 'User not found' });

  if (!await bcrypt.compare(password, user.password))
    return res.status(400).json({ error: 'Invalid password' });

  user.password = undefined;

  res.status(200).json({
    user,
    token: generateToken({ id: user._id })
  });
};
