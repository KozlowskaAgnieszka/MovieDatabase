const crypto = require('crypto');

const User = require('../models/users');

// Log user => GET
exports.getLogin = (req, res) => {
  res.render('login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: false,
    message: req.flash('message'),
  });
};

// Log user => POST
exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = crypto
    .createHash('sha256')
    .update(req.body.password)
    .digest('hex');

  User.findUserByEmail(email)
    .then(([user]) => {
      if (user[0].password === password) {
        req.session.isLoggedIn = true;
        req.session.user = user[0];
        res.redirect('/');
      } else {
        req.flash('message', 'Invalid user or password');
        return res.redirect('/login');
      }
    })
    .catch(() => {
      req.flash('message', 'No such user');
      return res.redirect('/login');
    });
};

// add new user => GET
exports.getSignup = (req, res) => {
  res.render('signup', {
    pageTitle: 'Signup',
    path: '/signup',
    isAuthenticated: false,
    message: req.flash('message'),
  });
};

// add new user => POST
exports.postSignup = (req, res) => {
  const email = req.body.email;
  const password = crypto
    .createHash('sha256')
    .update(req.body.password)
    .digest('hex');
  const confirmPassword = crypto
    .createHash('sha256')
    .update(req.body.confirmPassword)
    .digest('hex');

  if (password !== confirmPassword) {
    req.flash('message', 'Passwords do not match!');
    return res.redirect('/signup');
  }

  const user = new User(email, password);
  
  user
    .save()
    .then(() => {
      res.redirect('/login');
    })
    .catch((err) => {
      if (err.sqlState === '23000') {
        req.flash('message', 'Email already in use!');
        return res.redirect(`/signup`);
      }

      res.render('error', {
        pageTitle: 'Page not found',
        path: '',
        isAuthenticated: req.session.isLoggedIn,
      });
    });
};

// Logout user => POST
exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
