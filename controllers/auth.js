exports.getLogin = (req, res, next) => {
  const isLoggedIn = req
    .get('Cookie')
    .split(';')[0]
    .trim()
    .split('=')[1] === 'true';
  console.log(isLoggedIn, "ISLOGGEDIN, auth_controller/7");
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn //true
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie','loggedIn=true') //max-age, Expire=, secure, httpOnly -> can't be redirect with javascript
  res.redirect('/');
};
