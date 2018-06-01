const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');
const Project = require('../models/Project');
const utilsDB = require('../config/db');

exports.list = async (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');

  try {
    //const docs = await projects.find().toArray();
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
          "user.createdAt": 0,
          "user.password": 0
        }
      }
    ]).toArray();

    if (docs)
      res.status(200).json({ projects: docs });
    else
      res.status(500).json({ message: 'Nothing to return' });

  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.detail = async (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');

  const id = req.params.projectId;

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

exports.create = async (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');

  const userId = ObjectId(req.userId);

  const project = new Project({ ...req.body, userID: userId });

  try {
    const result = await projects.insertOne(project);

    if (result)
      res.status(201).json({ createdProduct: result.ops });

  } catch (err) {
    res.status(500).json({ message: `Error: ${err}` });
  }
};

exports.delete = async (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');

  const id = req.params.projectId;

  try {
    const result = await findOneAndDelete({ _id: ObjectId(id) });

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

exports.update = async (req, res, next) => {
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
