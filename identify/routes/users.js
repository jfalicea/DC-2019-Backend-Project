var express = require('express');
var router = express.Router();
const { sanitizeBody } = require('express-validator');
const User = require('../models/User');

const expressSession = require('express-session');

const sessionOptions = {
  // your 'secret' string should be on 'gitignore' (for example your .env file) so other people cannot see it on github
  secret: 'sda;lkjsd',
  resave: false,
  saveUninitialized: false
};

router.use(expressSession(sessionOptions));
/* GET users listing. */
router.get('/', function(req, res) {
  res.send('hello');
});

router.get('/register', function(req, res) {
  res.render('register', {
    title: 'Register'
  });
});

router.post('/registerProcess', [
  sanitizeBody('username').escape(),
  sanitizeBody('displayname').escape(),
  sanitizeBody('password').escape(),
], async (req, res) => {
  console.log(req.body);
 const newUserInfo = await User.createUser(req.body);
 console.log(newUserInfo);
res.json(newUserInfo);
});

router.get('/loginProcess', function(req, res) {
  res.render('login', {
    title: 'Login'
  });
});

router.post('/loginProcess', [
  sanitizeBody('username').escape(),
  sanitizeBody('password').escape(),
], async (req, res) => {
  const checkUserQuery = await User.checkQuery(req);
  console.log(checkUserQuery);
  if (checkUserQuery.id > 0) {

    req.session.username = checkUserQuery.username;
    req.session.loggedin = true;
    req.session.email = checkUserQuery.emails;
    req.session.iq = checkUserQuery.id;

    res.redirect(`/users/${checkUserQuery.id}/userpage`);
  } else if (checkUserQuery.id === 0) {
    res.redirect('/login?msg=badPass');
  } else if (checkUserQuery === 'Error') {
    res.json({
      msg: "userDoesNotExist"
    })
  }
});

router.get('/:userId/userpage', async (req, res) => {
  const theId = parseInt(req.params.userId, 10);
  const userInfo = await User.getAll(theId);
  res.render('userpage', {
    title: 'Userpage',
    username: userInfo.username
    // locals: {
    //   title: 'Userpage',
    //   displayname: userInfo.displayname
    // }
  });
});

module.exports = router;
