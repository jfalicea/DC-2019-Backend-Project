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

// router.all('*', (req, res, next) => {
//   if((!req.session.email) && (req.url !== '/login')){
//     res.redirect('/login')
//   }else{
//     console.log(req.session.email);
//     console.log(User.getAll(1).email);
//     next();
//   }
// });

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
  const userData = await User.getUsers();
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
  console.log(checkUserQuery.id);
  if (checkUserQuery.id > 0) {
    req.session.loggedin = true;
    req.session.email = checkUserQuery.emails;
    req.session.iq = checkUserQuery.id;
    res.redirect(`/users/database`);
  } else {
    res.redirect('/login?msg=badPass');
  }

});

module.exports = router;
