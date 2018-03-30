const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const Project = require('../models/Project');
const utilsDB = require('../config/db');

// Display list of all books.
exports.project_list = (req, res, next) => {
  const db = utilsDB.getDbConnection();

  db.collection('projects').find({}).toArray((err, docs) => {
    if (err) {
      res.status(500).json({
        message: `Error: ${err}`
      });
    } else {
      res.status(201).json({
        docs
      });
    }
  });
};

// Display detail page for a specific Project.
exports.project_detail = (req, res, next) => {
  res.send('NOT IMPLEMENTED: Project detail: ' + req.params.id);
};

// Display Project create form on GET.
exports.project_create_get = (req, res, next) => {
};

// Handle Project create on POST.
exports.project_create_post = (req, res, next) => {
  const db = utilsDB.getDbConnection();

  var project = new Project(req.body);
  console.log(project);
  console.log(req.body);

  db.collection('projects').insertOne(project, (err, r) => {
    if (err) {
      res.status(500).json({
        message: `Error: ${err}`
      });
    } else {
      res.status(201).json({
        r
        // createdProduct: product
      });
    }
  });
};

// Display Project delete form on GET.
exports.project_delete_get = (req, res, next) => {
  res.send('NOT IMPLEMENTED: Project delete GET');
};

// Handle Project delete on POST.
exports.project_delete_post = (req, res, next) => {
  res.send('NOT IMPLEMENTED: Project delete POST');
};

// Display Project update form on GET.
exports.project_update_get = (req, res, next) => {
  res.send('NOT IMPLEMENTED: Project update GET');
};

// Handle Project update on POST.
exports.project_update_post = (req, res, next) => {
  res.send('NOT IMPLEMENTED: Project update POST');
};
