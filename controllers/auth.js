exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req
  //   .get('Cookie')
  //   .split(';')[0]
  //   .trim()
  //   .split('=')[1] === 'true';
  // console.log(isLoggedIn, "ISLOGGEDIN, auth_controller/7");
  // console.log(isLoggedIn, "ISLOGGEDIN, auth_controller/7");
  res.render('auth/login', { //comes in true, goes out false
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader('Set-Cookie','loggedIn=true') //max-age, Expire=, secure, httpOnly -> can't be redirect with javascript
  req.session.isLoggedIn = true;
  res.redirect('/');
};
