const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();

authRouter.get(
  '/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get(
  '/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }), 
  (req, res) => {
    const token = jwt.sign(
      { user: req.user },
      process.env.JWT_SECRET || '',
      { expiresIn: "1h" },
    );
    res.cookie('jwtToken', token);
    res.redirect("http://localhost:3000/loginCheck");
  }
);

authRouter.get(
  '/logout', 
  (req, res, next) => {
    req.logout(function (err) {
      if (err) return next(err);
      res.redirect('/');
    });
  }
);

module.exports = { authRouter };
