const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');
const Project = require('../models/Project');
const utilsDB = require('../config/db');

exports.list = (req, res, next) => {
  const db = utilsDB.getDbConnection();

  db.collection('projects').find().toArray()
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.detail = (req, res, next) => {
  const db = utilsDB.getDbConnection();

  const id = req.params.projectId;

  db.collection('projects').findOne({ _id: ObjectId(id) })
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

  var project = new Project(req.body);

  db.collection('projects').insertOne(project)
    .then(result => {
      console.log(result.ops);
      res.status(201).json({
        createdProduct: result.ops
      });
    })
    .catch(err => {
      res.status(500).json({ message: `Error: ${err}` });
    });
};

exports.delete = (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const id = req.params.projectId;

  db.collection('projects').deleteOne({ _id: ObjectId(id) })
    .then(result => {
      console.log(result.deletedCount);
      res.status(200).json({ deletedCount: result.deletedCount });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.update = (req, res, next) => {
  const db = utilsDB.getDbConnection();
  const id = req.params.projectId;
  const updateOps = {};

  for (const ops of req.body) {
    updateOps[ops.proName] = ops.value;
  }

  db.collection('projects').updateOne({ _id: ObjectId(id) }, { $set: updateOps })
    .then(result => {
      console.log(result);
      res.status(200).json();
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
