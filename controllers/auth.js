const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', { //comes in true, goes out false
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('6205e342d7e5eb275cf3ca35')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    // res.setHeader('Set-Cookie','loggedIn=true') //this is how you set a cookie, attributes could involve max-age, Expire=, secure, httpOnly -> can't be redirect with javascript
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => { //destroys session then runs funtion afterwards
    console.log(err);
    res.redirect('/');
  });
};