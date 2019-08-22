var express = require('express');
var router = express.Router();
const { sanitizeBody } = require('express-validator');
const User = require('../models/User');
const Swal = require('sweetalert2');
const expressSession = require('express-session');

const sessionOptions = {
  // your 'secret' string should be on 'gitignore' (for example your .env file) so other people cannot see it on github
  secret: 'sda;lkjsd',
  resave: false,
  saveUninitialized: false,
  // cookie: { maxAge: 60000 }
};

router.use(expressSession(sessionOptions));

router.all('*', (req, res, next) => {
  if((req.session.loggedin === true) || (req.url === '/login') || (req.url === '/loginProcess') || (req.url === '/registerProcess')){
    next();
  }else{
    res.redirect('/login');
  }
});

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('hello');
});

router.post('/registerProcess', [
  sanitizeBody('first_name').escape(),
  sanitizeBody('last_name').escape(),
  sanitizeBody('email').escape(),
  sanitizeBody('company_name').escape(),
  sanitizeBody('password').escape(),
], async (req, res) => {
  console.log(req.body);
 const newUserInfo = await User.createUser(req.body);
 console.log(newUserInfo);
  res.render('reg-success');
});

router.get('/database', async (req, res) => {
  console.log(req.session.user_id);
  const sessionId = req.session.user_id;
  const userData = await User.getUsers(sessionId);
  const parsedData = JSON.stringify(userData);
  res.render('database', {
    title: 'Database',
    data: parsedData
  });
});

router.post('/loginProcess', [
  sanitizeBody('email').escape(),
  sanitizeBody('password').escape(),
], async (req, res) => {
  const checkUserQuery = await User.checkQuery(req);
  console.log('-----');
  console.log(checkUserQuery.company_id);
  if (checkUserQuery.id > 0) {
    req.session.loggedin = true;
    req.session.email = checkUserQuery.emails;
    req.session.user_id = checkUserQuery.ref_id;
    res.redirect(`/users/database`);
  } else {
    res.redirect('../../?msg=badPass');
  }

});

module.exports = router;
