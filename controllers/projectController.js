const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');
const Project = require('../models/Project');
const utilsDB = require('../config/db');

exports.list = (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');

  projects.find().toArray()
    .then(docs => {
      console.log(docs);
      if (docs.length === 0)
        res.status(200).json({
          count: docs.length,
          message: 'Nothing to return'
        });

      res.status(200).json({
        count: docs.length,
        projects: docs
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.detail = (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');

  const id = req.params.projectId;

  projects.findOne({ _id: ObjectId(id) })
    .then(doc => {
      console.log(`From Database ${doc}`);

      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: 'No valid entry found for provided ID' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: err });
    });
};

exports.create = (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');

  var project = new Project(req.body);

  projects.insertOne(project)
    .then(result => {
      console.log(result.ops);
      res.status(201).json({ createdProduct: result.ops });
    })
    .catch(err => {
      res.status(500).json({ message: `Error: ${err}` });
    });
};

exports.delete = (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');
  const id = req.params.projectId;

  projects.findOneAndDelete({ _id: ObjectId(id) })
    .then(result => {
      console.log(result);
      if (result.value === null)
        res.status(404).json({ error: 'Not found' });

      res.status(200).json({
        deletedCount: result.n,
        deleted: result.value
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.update = (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const projects = db.collection('projects');
  const id = req.params.projectId;
  const updateOps = {};

  for (const ops of req.body) {
    updateOps[ops.proName] = ops.value;
  }

  projects.updateOne({ _id: ObjectId(id) }, { $set: updateOps })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Product updated' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
