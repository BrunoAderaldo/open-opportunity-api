const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let db;

const url = 'mongodb://localhost:27017';
const dbName = 'open-jobs';

exports.connectDB = callback => {
  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log(`Connected successfully to ${dbName}`);

    db = client.db(dbName);

    callback(err, client);
  });
}

exports.getDbConnection = () => {
  return db;
}
