module.exports = function(app, passport) {

  // process the login form
  app.post('/login', passport.authenticate('local-login',{
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }));

  

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup',{
    successRedirect: '/dashboard',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect to profile.
      res.redirect('/dashboard');
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