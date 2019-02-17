var express = require('express');
var router = express.Router();
var User= require('../models/user')
var mid =require('../middleware')

//get / profile
router.get('/profile', mid.requiresLogin, function(req,res, next){
  if(! req.session.userId){
    var err = new Error('You are not authorized to view this page');
    err.status = 403;
    return next(err)
  }
  User.findById(req.session.userId)
    .exec(function (error, user){
        if (error){
          return next(error)
        } else{
          return res.render('profile', {title: 'Profile', name: user.name, 
          favorite: user.favoriteBook}); //data stored in db
        }
    });
});

//get / login
router.get('/logout', function(req,res, next){
  if(req.session){
    //delete session object
    req.session.destroy(function(err){
      if(err){
        return next(err);
      } else{
        return res.redirect('/')
      }
    })
  }
});

//get / login
router.get('/login', mid.loggedOut, function(req,res, next){
  return res.render('login',{ title: 'Log In'})
});

router.post('/login', function(req,res, next){
  if(req.body.email && req.body.password){ //check if email and password are put in
    User.authenticate(req.body.email, req.body.password, function(error, user){ //from user.js
        if(error || !user){
          var err= new Error('Wrong email and password!');
          err.status= 400;
          return next(err)
        } else{
          req.session.userId = user._id; //gets correct / unqique id. 
          return res.redirect('/profile');
        }
    }); 
  } else{
    var err= new Error('Email and password are required!');
    err.status= 401;
    return next(err)
  }
});



//get / register
router.get('/register', mid.loggedOut, function(req,res, next){
  return res.render('register',{title: 'Sign Up'} )

})

//recieve info in the registration form
router.post('/register', function(req,res, next){
  if(req.body.email &&
    req.body.name &&
    req.body.favoriteBook && 
    req.body.password &&
    req.body.confirmPassword){

      //confirm that the user typed same password twice
      if(req.body.password !== req.body.confirmPassword){
        var err= new Error('Passwords do not match!- Try again');
        err.status= 400
        return next(err)
      }
        //user object created from input form
        var userData= {
           email: req.body.email,
            name: req.body.name,
           favoriteBook: req.body.favoriteBook,
            password: req.body.password 
        }

        //use schema create to insert into mongo
        User.create(userData, function(error, user){
          if(error){
            return next(error)
          } else{
            req.session.userId = user._id; //gets correct / unqique id. Once registered also logged in from 'login'
            return res.redirect('/profile');
          }
        });

  } else{
    var err= new Error('All fields are required please!');
    err.status= 400
    return next(err)
  }

})

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
