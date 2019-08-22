var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const passwordFail = req.query.msg === 'badPass' ? true : false;
  res.render('index', { passwordFail });
});

router.get('/app', function (req, res) {
  res.render('appindex');
});

module.exports = router;
