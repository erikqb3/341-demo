const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const errorController = require('./controllers/error');
// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('5baa2528563f16379fc8a610')
//     .then(user => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    // 'mongodb+srv://erikqb3:1KobeR.Shoryu_red@finalcse431shop.wlbdo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@finalcse431shop.wlbdo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
  .then(result => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
