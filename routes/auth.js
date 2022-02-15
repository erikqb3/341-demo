const express = require('express');

const  { check,body } = require('express-validator') //npm install --save express-validator

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
body('email')
  .isEmail()
  .withMessage('😒 Please enter a valid email 😒')
  .normalizeEmail(),
body('password',"Please enter a password with only numbers and text and at least 5 characters")
  .isLength({ min: 5 })
  .trim()
  // .isAlphanumeric() //no special char, only letters and numbers
],
authController.postLogin);

router.post('/signup', [
      
    check('email')
      .isEmail()
      .withMessage('😒 Please enter a valid email 😒')
      .custom((value, { req }) => {
        // if (value === "fake@email.com") {
        //   throw new Error('☠ This email address if forbidden. ☠');
        // }
        // return true;
        return User.findOne({email: value}) //left-> database email, right->input email
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject('😝 Email exists already, please pick a different one. 😝');
          }
        });
      })
      .normalizeEmail(),
    body('password',
    "Please enter a password with only numbers and text and at least 5 characters")
      .isLength({min: 5})
      .trim(),
      // .isAlphanumeric(), //only letters and numbers, not special char
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('😘 Passwords have to match! 😘');
        }
        return true;
      })
  ],
  authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;