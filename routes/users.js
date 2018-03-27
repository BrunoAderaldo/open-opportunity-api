var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET requests to /users'
  });
});

router.post('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling POST requests to /users'
  });
});

router.get('/:userId', (req, res, next) => {
  res.status(200).json({
    message: 'Handling requests to /users'
  });
});

module.exports = router;
