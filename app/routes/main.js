var User = require('../models/user');
var Path = require('../models/path');
var Step = require('../models/step');
var Enrollment = require('../models/enrollment');
var Rating = require('../models/rating');


module.exports = function(app, passport) {

  // home page
  app.get('/', function(req, res) {
    // res.status(200).json({message:'Welcome to YouLearn'});
    res.render('pages/index.ejs',{
      user: req.user
    });
  });

  // show the login form
  app.get('/login', function(req, res) {
    //res.status(200).json({message:'Login Page'});
    res.render('pages/login.ejs',{
      user: req.user
    });
  });

  // show the signup form
  app.get('/signup', function(req, res) {
    // res.status(200).json({message:'Signup Page'});
    res.render('pages/signup.ejs',{
      user: req.user
    });
  });

  app.get('/edit-profile',isLoggedIn,(req,res)=>{
    res.render('pages/edit-profile',{
      user: req.user
    });
  });

  app.post('/edit-profile',isLoggedIn,(req,res)=>{
    User.findOne({_id:req.user._id})
      .then(user=>{
        user.username = req.body.username;
        return user.save();
      })
      .then(newUser=>{
        res.redirect('/dashboard');
      })
      .catch(errorHandler);
  });

  app.get('/dashboard', isLoggedIn, function(req, res) {
    // res.status(200).json({message:'Profile Page',user:req.user});
    /* {
        path: currentStep,
      }*/

    let userEnrollments = {};

    Enrollment.find({user:req.user._id})
      .then(enrollments=>{
        enrollments.forEach(enrollment=>{
          userEnrollments[enrollment.path] = enrollment.currentStep
        });
        return Path.find();
      })    
      .then((paths)=>{
        res.render('pages/dashboard.ejs',{
          user: req.user,
          paths: paths,
          enrollments: userEnrollments
        });
      })
      .catch(errorHandler);
  });

  app.get('/path/enroll/:pathid/:userid',isLoggedIn,(req,res)=>{
    if(req.params.userid.toString() === req.user._id.toString()){
      Enrollment.create({
        user: req.params.userid,
        path: req.params.pathid
      })
      .then(enrollment=>{
        res.redirect(`/path/${req.params.pathid}`);
      })
      .catch(errorHandler);
    }
  });

  app.get('/path/:pathid',isLoggedIn,(req,res)=>{
    let path;
    let enrollment;
    Enrollment.findOne({path:req.params.pathid,user:req.user._id})
      .then(foundEnrollment=>{
        enrollment = foundEnrollment;
        return Path.findOne({_id:req.params.pathid});
      })
      .then(foundPath=>{
        path = foundPath;
        return Step.find({path:req.params.pathid})
      })
      .then(steps=>{
        res.render('pages/path',{
          user: req.user,
          path: path,
          enrollment: enrollment,
          steps: steps
        });
      })
      .catch(errorHandler);
  });

  app.get('/next-step/:pathid', isLoggedIn, (req,res)=>{
    let path;
    let enrollment;
    Enrollment.findOne({path:req.params.pathid, user: req.user._id})
      .then(foundEnrollment=>{
        enrollment = foundEnrollment;
        return Path.findOne({_id:req.params.pathid})
      })
      .then(foundPath => {
        path = foundPath;
        enrollment.currentStep = enrollment.currentStep + 1;
        return enrollment.save();
      })
      .then(enrollment => {
        res.redirect(`/path/${path._id}`);
      })
      .catch(errorHandler);
  });

  app.post('/finish-path', isLoggedIn, (req,res)=>{
    let totalRatings = 0;
    let totalScore = 0;
    let completedPath;
    Enrollment.findOne({path:req.body.path,user:req.user._id})
      .then(enrollment=>{
        enrollment.currentStep = enrollment.currentStep + 1;
        return enrollment.save();
      })
      .then(savedEnrollment=>{
        return Rating.findOne({user:req.user._id, path:req.body.path})
      })
      .then(rating=>{
        if(!rating){
          return Rating.create({
            user: req.user._id,
            path: req.body.path,
            rating: parseInt(req.body.rating),
            review: req.body.review
          });
        }
      })
      .then(rating=>{
        return Rating.find({path:req.body.path});
      })
      .then(ratings=>{
        totalRatings = ratings.length;
        ratings.forEach(rating=>{
          totalScore += rating.rating;
        });
        return Path.findOne({_id:req.body.path});
      })
      .then(path=>{
        path.numReviews = totalRatings;
        path.rating = totalScore / totalRatings;
        return path.save();
      })
      .then(path=>{
        completedPath = path;
        return User.findOne({_id:req.user._id});
      })
      .then(user=>{
        user.completed.push(completedPath._id);
        return user.save();
      })
      .then(user=>{
        res.redirect('/dashboard');
      })
      .catch(errorHandler);
  });

  app.get('/create-path', isLoggedIn, function(req,res){
    res.render('pages/create-path.ejs',{
      user: req.user
    });
  });

  app.get('/edit-path/:id', isLoggedIn, function(req,res){
    let editedPath;
    Path.findOne({_id:req.params.id})
      .then(path=>{
        if(path.author._id.toString() === req.user._id.toString()){
          editedPath = path;
          return Step.find({path:req.params.id});
        } else {
          res.redirect('/dashboard');
        }
      })
      .then(steps=>{
        res.render('pages/edit-path.ejs',{
          user: req.user,
          steps: steps,
          path: editedPath
        });
      })
      .catch(errorHandler);
    
  });

  app.post('/edit-path/:id', isLoggedIn, function(req,res){
    req.body.tags = req.body.tags.split(",");
    Path.findOneAndUpdate({_id:req.params.id},req.body)
      .then(path=>{
        res.redirect(`/edit-path/${req.params.id}`);
      })
      .catch(errorHandler);
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
    req.body.tags = req.body.tags.split(",");
    Path.findOrCreate(req.body)
      .then((path)=>{
        res.redirect('/dashboard');
      })
      .catch(errorHandler);
  })

  // Step

  app.get('/steps', (req,res)=>{
    Step.find()
      .then((steps)=>res.send(steps))
      .catch(errorHandler);
  });

  app.get('/add-step/:pathID', isLoggedIn, (req,res)=>{
    Path.findOne({_id:req.params.pathID})
      .then(path=>{
        if(path.author._id.toString() === req.user._id.toString()){
          res.render('pages/add-step',{
            user: req.user,
            path: path
          });
        } else {
          res.redirect('/dashboard');
        }
      })
      .catch(errorHandler);
  });

  app.post('/step',(req,res)=>{
    // console.log(req.body);
    // title, path (ref), link, text
    Step.findOrCreate(req.body)
      .then((step)=>res.redirect(`/edit-path/${req.body.path}`))
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