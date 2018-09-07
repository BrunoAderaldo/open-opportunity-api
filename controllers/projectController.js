const ObjectId = require('mongodb').ObjectID;
const Project = require('../models/Project');
const utilsDB = require('../config/db');
const { body, check, validationResult } = require('express-validator/check');

exports.list = async (req, res) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');

  try {
    const docs = await projects.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userID',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          'userID': 0,
          'user.createdAt': 0,
          'user.password': 0
        }
      }
    ]).toArray();

    if (docs)
      res.status(200).json({
        code: 200,
        projects: docs
      });
    else
      res.status(404).json({
        code: 404,
        message: 'Nothing to return'
      });

  } catch (error) {
    res.status(500).json({
      code: 500,
      error: error.message,
      description: error.stack
    });
  }
};

exports.detail = async (req, res) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');

  const { id } = req.params;

  try {
    const doc = await projects.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userID',
          foreignField: '_id',
          as: 'user'
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

    if (doc)
      res.status(200).json(doc);
    else
      res.status(404).json({ message: 'No valid entry found for provided ID' });

  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.create = [
  check('name')
    .isLength({ min: 10 })
    .withMessage('The project name must contain 10 or more characters'),

  check('description')
    .isLength({ min: 30 })
    .withMessage('The project description must contain 30 or more characters'),

  check('skills')
    .isArray()
    .withMessage('Skills must be array'),

  check('skills.*')
    .isString()
    .withMessage('Each skill must be String')
    .isLength({ min: 1 })
    .withMessage('Each skill must contain at least 1 character'),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(422).json({
        code: 422,
        errors: errors.array()
      });

    const db = utilsDB.getDbConnection();
    const projects = db.collection('projects');

    const userID = ObjectId(req.userId);

    const project = new Project({ ...req.body, userID });

    try {
      const result = await projects.insertOne(project);

      if (result)
        res.status(201).json({ createdProduct: result.ops });

    } catch (err) {
      res.status(500).json({ message: `Error: ${err}` });
    }
  }
];

exports.delete = async (req, res) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');

  const id = req.params.projectId;

  try {
    const result = await projects.findOneAndDelete({ _id: ObjectId(id) });

    if (result.value)
      res.status(200).json({
        deletedCount: result.n,
        deleted: result.value
      });
    else
      res.status(404).json({ error: 'Not found' });

  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.update = async (req, res) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');

  const id = req.params.projectId;
  const updateOps = {};

  for (const ops of req.body) {
    updateOps[ops.proName] = ops.value;
  }

  try {
    const result = await projects.updateOne({ _id: ObjectId(id) }, { $set: updateOps });

    if (result)
      res.status(200).json({ message: 'Product updated' });

  } catch (err) {
    res.status(500).json({ error: err });
  }
};
