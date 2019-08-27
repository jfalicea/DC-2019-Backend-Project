var express = require('express');
var router = express.Router();
const { sanitizeBody } = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  const passwordFail = req.query.msg === 'badPass' ? true : false;
  res.render('index', { passwordFail });
});

router.get('/retrieve', function(req, res) {
  res.render('forgot-pw');
});

router.post('/retrieve', [
  sanitizeBody('email').escape(),
], function(req, res) {
  // send email to user's email address with password reset instructions inside
  res.render('forgot-success');
});

router.get('/app', async function (req, res) {
  res.render('appindex', {
    user_name: 'Eugene',
    user_email: 'ekim1707@gmail.com',
    company_name: 'Unknown',
    URL: '/img/logo.png'
  });
});

module.exports = router;
