const ObjectId = require('mongodb').ObjectID;
const Project = require('../models/Project');
const utilsDB = require('../config/db');
const { check, validationResult } = require('express-validator/check');

exports.index = async (req, res) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');

  try {
     const docs = await projects.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
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

exports.show = async (req, res) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');

  const id = req.params.id;

  try {
    const doc = await projects.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
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

exports.store = [
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

    const userId = ObjectId(req.userId);

    const project = new Project({ ...req.body, userId });

    try {
      const result = await projects.insertOne(project);

      if (result)
        res.status(201).json({ createdProduct: result.ops });

    } catch (err) {
      res.status(500).json({ message: `Error: ${err}` });
    }
  }
];

exports.update = [
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

    try {
      const db = utilsDB.getDbConnection();
      const projects = db.collection('projects');

      const {id} = req.params;

      const project = await projects.findOne({ _id: ObjectId(id) });

      if (!project.userId.equals(req.userId))
        return res.sendStatus(401);

      Object.keys(req.body).forEach(key => project[key] = req.body[key]);

      const result = await projects.updateOne({ _id: ObjectId(id) }, { $set: project });

      if (result)
        res.status(200).json({
          message: 'Product updated',
          project
        });

    } catch (err) {
      res.status(500).json({
        code: 500,
        error: err.message,
        description: err.stack
      });
    }
  }
];

exports.destroy = async (req, res) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection("projects");

  const {id} = req.params;

  const project = await projects.findOne({ _id: ObjectId(id) });

  if (!project.userId.equals(req.userId))
    return res.sendStatus(401);

  try {
    const result = await projects.findOneAndDelete({ _id: ObjectId(id) });

    if (result.value)
      res.status(200).json({
        deletedCount: result.n,
        deleted: result.value
      });
    else res.status(404).json({ error: "Not found" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
