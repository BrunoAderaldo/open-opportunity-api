const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let db;
let URL;

if (process.env.NODE_ENV !== 'development') {
  URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}${process.env.DB_HOST}${process.env.DB_NAME}`;
} else {
  URL = process.env.DB_LOCAL;
}

const dbName = process.env.DB_NAME;

exports.connectDB = callback => {
  MongoClient.connect(URL, (err, client) => {
    assert.equal(null, err);
    console.log(`Connected successfully to ${dbName}`);

    db = client.db(dbName);

    callback(err, client);
  });
}

exports.getDbConnection = () => {
  return db;
}
