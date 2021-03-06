const ObjectId = require('mongodb').ObjectID;
const utilsDB = require('../config/db');

exports.index = async (req, res) => {
  const db = utilsDB.getDbConnection();
  const users = db.collection('users');

  try {
    const docs = await users.find().project({ password: 0 }).toArray();

    if (docs)
      res.status(200).json({
        code: 200,
        users: docs
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
  const users = db.collection('users');

  const {id} = req.params;

  try {
    const user = await users.aggregate([
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: 'userId',
          as: 'projects'
        }
      },
      {
        $match: { _id: ObjectId(id) }
      },
      {
        $project: {
          'createdAt': 0,
          'password': 0,
          'projects.userId': 0
        }
      }
    ]).toArray();

    if (user.length === 0)
      return res.status(404).json({
        code: 404,
        msg: 'User not found'
      });

    res.status(200).json({
      code: 200,
      user
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      msg: error.message,
      description: error.stack
    });
  }
};

exports.update = async (req, res) => {
  const db = utilsDB.getDbConnection();
  const users = db.collection('users');

  try {
    const { id } = req.params;

    const user = await users.findOne({ _id: ObjectId(id) });

    if (!user._id.equals(req.userId))
      return res.sendStatus(401);

    Object.keys(req.body).forEach(key => user[key] = req.body[key]);

    const result = await users.updateOne({ _id: ObjectId(id) }, { $set: user });

    if (result) {
      res.status(200).json({
        message: 'Usuário atualizado',
        user
      });
    }
  } catch (err) {
    res.status(500).json({
      code: 500,
      error: err.message,
      description: err.stack
    });
  }
};
