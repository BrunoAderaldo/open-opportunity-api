const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let db;

const dbName = process.env.DB_NAME;

exports.connectDB = callback => {
  MongoClient.connect(process.env.DB_HOST, (err, client) => {
    assert.equal(null, err);
    console.log(`Connected successfully to ${dbName}`);

    db = client.db(dbName);

    callback(err, client);
  });
}

exports.getDbConnection = () => {
  return db;
}
