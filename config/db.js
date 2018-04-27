const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let db;
const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}${process.env.DB_HOST}${process.env.DB_NAME}`;

const dbName = process.env.DB_NAME;

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
