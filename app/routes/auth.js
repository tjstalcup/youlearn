module.exports = function(app, passport) {

  // process the login form
  // app.post('/login', do all our passport stuff here);

  

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect to profile.
      res.redirect('/profile');
  });

  // logout
  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });
};

// middleware to detect login
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();

  res.redirect('/');
}