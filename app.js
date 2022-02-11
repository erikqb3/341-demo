const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config(); //heroku stuff

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

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
    saveUninitialized: false
  })
);

app.use((req, res, next) => {
  User.findById('6205e342d7e5eb275cf3ca35')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
const port = process.env.PORT || 3000;


mongoose
  .connect(
    // 'mongodb+srv://erikqb3:1KobeR.Shoryu_red@finalcse431shop.wlbdo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@finalcse431shop.wlbdo.mongodb.net/shop?retryWrites=true&w=majority`, { userNewUrlParser: true, useUnifiedTopology: true}
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User ({
          name: "Erik",
          email: "scrapmail4erik@gmail.com",
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(port);
  })
  .catch(err => {
    console.log(err);
  });

  // heroku config:set DB_USER=erikqb3
  // heroku config:set DB_PASS=1KobeR.Shoryu_red
