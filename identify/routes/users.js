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

// router.all('*', (req, res, next) => {
//   if((req.session.loggedin === true) || (req.url === '/login') || (req.url === '/loginProcess') || (req.url === '/registerProcess')){
//     next();
//   }else{
//     res.redirect('/');
//   }
// });

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
  req.session.loggedin = true;
  req.session.user_id = newUserInfo.id;
  req.session.user_email = newUserInfo.employees.email;
  if(newUserInfo.msg === 'error'){
  res.render('reg-failure');
  } else {
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
  const email = req.query.email;
  res.redirect(`/users/remove/warning/?email=${email}`);
});

router.get('/remove/warning', function(req, res) {
  res.render('del-warning', {
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
  const email = req.body.email;
  let employeeData = await User.checkEmployee(email);

  const string = `Name ${employeeData.user_name} Email ${employeeData.user_email} Company Name`
  const code = await User.createQRcode(string);
  const code2 = code.replace('public/','/')
  console.log(code2)

  res.render('appindex', {
    title: 'QR Code', 
    qrPic: "qr code goes here",
    user_name: employeeData.user_name,
    user_email: employeeData.user_email,
    emp_status: employeeData,
    company_name: employeeData.company_name,
    URL: code2
  });
});

module.exports = router;
