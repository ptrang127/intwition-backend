var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is the endpoint to get the analysis');
});

module.exports = router;
