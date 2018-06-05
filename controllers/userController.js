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
      return res.status(409).json({
        code: 409,
        error: true,
        message: 'Email already exists'
      });

    await bcrypt.hash(password, 12, (err, hash) => {
      if (err)
        return res.status(500).json({
          code: 500,
          error: err
        });

      const user = new User({
        email,
        password: hash
      });

      users.insertOne(user)
        .then(result => {
          user.password = undefined;

          res.status(201).json({
            code: 201,
            message: 'User created',
            user,
            token: generateToken({ id: user._id })
          });
        })
        .catch(error => {
          res.status(500).json({
            code: 500,
            error
          });
        });
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      error
    });
  }
};

exports.authenticate = async (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const users = db.collection('users');

  const { email, password } = req.body;

  try {
    const user = await users.findOne({ email });

    if (!user)
      return res.status(400).json({
        code: 400,
        error: 'User not found'
      });

    if (!await bcrypt.compare(password, user.password))
      return res.status(400).json({
        code: 400,
        error: 'Invalid password'
      });

    user.password = undefined;

    res.status(200).json({
      code: 200,
      user,
      token: generateToken({ id: user._id })
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      error: error.message,
      description: error.stack
    });
  }
};

exports.showProfile = async (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const users = db.collection('users');

  const { id } = req.params;

  try {
    const user = await users.aggregate([
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: 'userID',
          as: 'projects'
        }
      },
      {
        $match: { _id: ObjectId(id) }
      },
      {
        $project: {
          "user.createdAt": 0,
          "user.password": 0
        }
      }
    ]).toArray();

    if (user.length === 0)
      return res.status(404).json({
        code: 404,
        message: 'User not found'
      });

    res.status(200).json({
      code: 200,
      user
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      description: error.stack
    });
  }
};
