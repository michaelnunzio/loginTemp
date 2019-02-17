function loggedOut(req, res, next) { //if user tries going to any root we don't wont them to see. 
    if (req.session && req.session.userId) {
      return res.redirect('/profile');
    }
    return next();
  }
//for /profile
  function requiresLogin(req, res, next) { 
  if (req.session && req.session.userId) {
    return next()
  } else{
      var err= Error('You must be logged in to view that page!')
      err.status= 401;
        return next(err);
  }
  
}

    module.exports.requiresLogin = requiresLogin;
    module.exports.loggedOut = loggedOut;