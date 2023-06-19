exports.getErrorPage = (req, res) => {
  res.render('error', {
    pageTitle: 'Page not found',
    path: '',
    isAuthenticated: req.session.isLoggedIn,
  });
};
