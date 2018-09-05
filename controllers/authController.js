const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const utilsDB = require('../config/db');
const { check, validationResult } = require('express-validator/check');

function generateToken(params = {}) {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: 86400
  });
}

exports.register = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),

  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must contain 6 or more characters'),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(422).json({
        code: 422,
        errors: errors.array()
      });

    const db = utilsDB.getDbConnection();
    const users = db.collection('users');

    const { email, password } = req.body;

    try {
      if (await users.findOne({ email }))
        return res.status(409).json({
          code: 409,
          error: true,
          msg: 'Email already exists'
        });

      await bcrypt.hash(password, 12, (error, hash) => {
        if (error)
          return res.status(500).json({
            code: 500,
            error: error.message,
            description: error.stack
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
              msg: 'User created',
              user,
              token: generateToken({ id: user._id })
            });
          })
          .catch(error => {
            res.status(500).json({
              code: 500,
              error: error.message,
              description: error.stack
            });
          });
      });
    } catch (error) {
      return res.status(400).json({
        code: 400,
        error
      });
    }
  }
];

exports.authenticate = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),

  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must contain 6 or more characters'),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(422).json({
        code: 422,
        errors: errors.array()
      });

    const db = utilsDB.getDbConnection();
    const users = db.collection('users');

    const { email, password } = req.body;

    try {
      const user = await users.findOne({ email });

      if (!user)
        return res.status(400).json({
          code: 400,
          error: 'User not found',
          msg: 'Check the email informed'
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
  }
];
