var mongoose = require('mongoose');
var bcrpyt= require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});
//authenticate input
UserSchema.statics.authenticate= function(email, password, callback) { //statics allows you to add methods to the model.
  User.findOne({email:email})
    .exec(function(error, user){
      if(error){
        return callback(error);
      } else if(!user) {
        var err = new Error('User not found. Try again!')
        err.status= 401;
        return callback(err) //error if email was not in db.
      } 
      bcrpyt.compare(password, user.password, function(error, result){ //compare is a bcrypt method 
        if(result === true){
          return callback(null, user);
        } else {
          return callback();
        }
      });
    });
}

//has password before sending it
UserSchema.pre('save', function(next){
  var user= this; //holds the above object
  bcrpyt.hash(user.password, 10, function(err, hash){
    if(err){
      return next(err);
    }
    user.password= hash;
    next(); //calls the next function in the stack after sending.
  })

});

var User = mongoose.model('User', UserSchema);
module.exports = User;
