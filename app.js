const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session'); // npm install --save express-session
const MongoDBStore = require('connect-mongodb-session')(session); // npm install --save connect-mongodb-session
const csrf = require('csurf'); //npm install --save csurf
const flash = require('connect-flash') //npm install --save connect-flash
require('dotenv').config(); //heroku stuff

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@finalcse431shop.wlbdo.mongodb.net/shop`; //`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@finalcse431shop.wlbdo.mongodb.net/shop?&w=majority`

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin'); //this is where you connect view routes or something
const shopRoutes = require('./routes/shop'); //see app.use section, which applies this stuff
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  })
  // res.setHeader('Set-Cookie','loggedIn=true') //this is how you set a cookie, attributes could involve max-age, Expire=, secure, httpOnly -> can't be redirect with javascript
  .catch(err => {
    next(new Error(err))});
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500',errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error, "500 ERROR");
  res.redirect('/500');
})

const port = process.env.PORT || 3000;


mongoose
  .connect(
    // 'mongodb+srv://erikqb3:1KobeR.Shoryu_red@finalcse431shop.wlbdo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    MONGODB_URI, { userNewUrlParser: true, useUnifiedTopology: true}
  )
  .then(result => {
    app.listen(port);
  })
  .catch(err => {
    console.log(err);
  });

  // heroku config:set DB_USER=erikqb3
  // heroku config:set DB_PASS=1KobeR.Shoryu_red
