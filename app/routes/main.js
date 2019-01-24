var User = require('../models/user');
var Path = require('../models/path');
var Step = require('../models/step');


module.exports = function(app, passport) {

  // home page
  app.get('/', function(req, res) {
    res.status(200).json({message:'Welcome to YouLearn'});
  });

  // show the login form
  app.get('/login', function(req, res) {
    res.status(200).json({message:'Login Page'});
  });

  // show the signup form
  app.get('/signup', function(req, res) {
    res.status(200).json({message:'Signup Page'});
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    res.status(200).json({message:'Profile Page',user:req.user});
  });

  // Temp Routes - just for testing

  app.get('/users', (req,res)=>{
    User.find()
      .then((users)=>res.send(users))
      .catch(errorHandler);
  });

  // Path

  app.get('/paths', (req,res)=>{
    Path.find()
      .then((paths)=>res.send(paths))
      .catch(errorHandler);
  });

  app.get('/path/:id', (req,res)=>{
    let path;
    // Path.find({_id:req.params.id}) -> [{},{}], [{}], []
    Path.findOne({_id:req.params.id}) // {}, null/undefined
      .then((foundPath)=>{
        path = foundPath;
        return Step.find({path:path._id})
      })
      .then((steps)=>{
        res.send({path,steps});
      })
      .catch(errorHandler);
  });

  app.post('/path',(req,res)=>{
    // console.log(req.body);
    // title, category, author (ref), tags, rating, numReviews
    Path.findOrCreate(req.body)
      .then((path)=>res.json(path))
      .catch(errorHandler);
  })

  // Step

  app.get('/steps', (req,res)=>{
    Step.find()
      .then((steps)=>res.send(steps))
      .catch(errorHandler);
  });

  app.post('/step',(req,res)=>{
    // console.log(req.body);
    // title, path (ref), link, text
    Step.findOrCreate(req.body)
      .then((step)=>res.json(step))
      .catch(errorHandler);
  })

};

// middleware to detect login
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();

  res.redirect('/');
}

// route middleware to make sure a user is logged in as an admin
function isAdmin(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated() && req.user.level == 'admin')
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

function errorHandler(err){
  console.error(err);
}