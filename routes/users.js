var express = require('express');
var router = express.Router();
const { sanitizeBody } = require('express-validator');
const User = require('../models/User');
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
  if((req.session.loggedin === true) || (req.url === '/employee') || (req.url === '/login') || (req.url === '/loginProcess') || (req.url === '/registerProcess')){
    next();
  } else {
    res.redirect('/');
  }
});

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
  const newUserInfo = await User.checkUser(req.body);
  if(newUserInfo.msg === 'error'){
  res.render('reg-failure');
  } else {
  req.session.loggedin = true;
  req.session.user_id = newUserInfo.id;
  req.session.user_email = newUserInfo.employees.email;
  res.render('reg-success', {
    user_email: req.session.user_email
  });
  }
});

router.get('/database', async (req, res) => {
  const sessionId = req.session.user_id;
  const userData = await User.getUsers(sessionId);
  const param = req.query.resume;
  const email = req.query.email;
  const user_email = req.session.user_email;

  res.render('database', {
    title: 'Database',
    userData: userData,
    resume: param,
    email: email,
    user_email: user_email
  });
});

router.post('/database/update', [
  sanitizeBody('first_name').escape(),
  sanitizeBody('last_name').escape(),
  sanitizeBody('email').escape(),
  sanitizeBody('user_role').escape(),
  sanitizeBody('emp_status').escape(),
  sanitizeBody('password').escape(0)
], async (req, res) => {
  const addedEmployee = await User.adminCreate(req.body, req.session.user_id);

  res.redirect('/users/database/?resume=true1');
});

router.post('/loginProcess', [
  sanitizeBody('email').escape(),
  sanitizeBody('password').escape(),
], async (req, res) => {
  const checkUserQuery = await User.checkQuery(req);
  if (checkUserQuery.id > 0) {
    req.session.loggedin = true;
    req.session.user_id = checkUserQuery.ref_id;
    req.session.user_email = checkUserQuery.user_email;
    res.redirect(`/users/database/?resume=false&user_email=${req.body.email}`);
  } else {
    res.redirect('/?msg=badPass');
  }

});

router.get('/remove', async (req, res) => {
  const first_name = req.query.first_name;
  const last_name = req.query.last_name;
  const email = req.query.email;
  res.redirect(`/users/remove/warning/?first_name=${first_name}&last_name=${last_name}&email=${email}`);
});

router.get('/remove/warning', function(req, res) {
  res.render('del-warning', {
    first_name: req.query.first_name,
    last_name: req.query.last_name,
    email: req.query.email
  });
});

router.get('/remove/confirm', async function(req, res) {
  const email = req.query.email;
  const remove = await User.removeEmployee(email);
  res.redirect('/users/database/?resume=true');
})

router.get('/logout', function (req, res) {

  req.session.destroy();
  res.redirect('/');

});

router.post('/employee', async function (req, res) {
  let employeeData = await User.checkEmployee(req);
  const string = `Company name: ${employeeData.company_name}\nEmployee Name: ${employeeData.user_name}\nEmployee Email: ${employeeData.user_email}\nFor more assistance, call insta.ID: 999-999-9999\nTo send feedback: instaid@gmail.com`;
  const code = await User.createQRcode(string);
  const code2 = code.replace('public/','/');

  if (employeeData.id) {
    res.render('appindex', {
      URL: code2
    });
  } else {
    res.render('appindex', {
      URL: 'https://image.flaticon.com/icons/svg/1159/1159417.svg'
    });
  }

});

module.exports = router;
