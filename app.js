var express = require('express');
var bodyParser = require('body-parser');
var mongoose= require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);
var app = express();

//mongoose mongodb
mongoose.connect('mongodb://localhost:27017/bookclub', 
{ useNewUrlParser: true }); //useNewUrlParser- yes, just added

// mongoose.get('/models/user.js')

var db= mongoose.connection;
//mongo error habdler
db.on('error', console.error.bind(console, 'connection error:'));

//session to remember user- also tracks your site. Store sessions in mongo.
app.use(session( {
  secret: 'session working',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
   mongooseConnection: db
  })
}));

//user id available to pug(update later when using react)
app.use(function(req, res, next){
  res.locals.currentUser= req.session.userId;
  next(); //locals add info to the response object
})


// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
