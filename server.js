

// first, we need to call the packages we need.
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: './uploads/'});
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var FBStrategy = require('passport-facebook').Strategy;

var config = require('./config');

var Book = require('./app/models/book');
var User = require('./app/models/user');


var userRoutes = require('./userRoutes.js');
var bookRoutes = require('./bookRoutes.js');
                         
                         
                         
// configure body parser - middleware parsers.  ASK MARK.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


passport.use(new FBStrategy({
    //clientID: , //unsure if this should contain userID or appId
    //clientSecret:  // same uncertainty as above
    callbackURL: "http://localhost:3030/login/facebook/return" // once approved, users will be redirected to this page.
},
   function(accessToken, refreshToken, profile, done) { // the stuff following this line should save the fb profile with a user record in db............ - according to github ex.
        User.findOrCreate(..., function(err, user) {
            if (err) { return done(err); }
            done(null, user);
        });
    }                                              
));


app.get('/auth/facebook', passport.authenticate('facebook')); // redirects user for fb auth
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));



// set up our port- the mumbo jumbo is fancy stuff telling the app to use environment variable available or 8080;
var port = process.env.PORT || 8080;


// connect our database (also see var mongoose and var book called ^^ at the start.  they also set up our DB)
mongoose.connect(config.database);
app.set('superSecret', config.secret);


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, "we're connected!"));


//  create route handlers
var router = express.Router();  


// sets up middleware for all requests
router.use(function(req, res, next){
    // log
    console.log('something is happening!');
    next();
    // ^^ go to the next thing.  Otherwise app dies.
});


// test route 
// (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'yay you!' });
});
// (accessed at GET http://localhost:8080)
app.get('/', function(req, res) {
    res.json({ message: 'yay!' });
});




app.use('/sun', router);
app.use('/sun', bookRoutes);
app.use('/sun', userRoutes);







// route to authenticate a user (POST http://localhost:8080/sun/auth)
router.post('/auth', function(req, res) {

  // find the user
  User.findOne({
    userName: req.body.userName // look through userNames in db and compare to the request that was received
  }, function(err, user) {

    if (err) throw err;

    if (!user) { // if user not found, 
      res.json({ success: false, message: 'You sure you have the right name?' });
    } else if (user) { // if user === true

      if (user.password != req.body.password) { // if password doesnt match
        res.json({ success: false, message: 'Wrong PW!  Sry, try again' });
      } else {

        // if user is fo00und and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          // expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'You pass',
          token: token
        });
      }   

    }

  });
});


router.use(function(req, res, next) {
    
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (token) {
        jwt.verify(token, app.get('superSecret'), function(err, decoded){
            if (err) {
                return res.json({success: false, message: "no access" });
            }
            else {
                // res.json({ message: 'congrats you got here'});
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        return res.status(403).send({
            success: false,
            message: "no token"
        });
    }
});










// start routes - sets up initial extension in this case "/boooo/"- Nothing to do with mongoose dB.
// app.use('/sun', router);
// app.use('/sun', bookRoutes);
// app.use('/sun', userRoutes);


// start server
app.listen(port);
console.log("Magic happening on port " + port);
    
    
    
