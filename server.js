

// first, we need to call the packages we need.
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: './uploads/'});
var mongoose = require('mongoose');
var jwt    = require('jsonwebtoken');

var config = require('./config');
var Book = require('./app/models/book');
var User = require('./app/models/user');
//  ^^ importing user module


var userRoutes = require('./userRoutes.js');

                         
                         
                         
// configure body parser - middleware parsers.  ASK MARK.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set up our port- the mumbo jumbo is fancy stuff telling the app to use whatever port is available or 8080;
var port = process.env.PORT || 8080;


// connect our database (also see var mongoose and var book called ^^ at the start.  they also set up our DB)
mongoose.connect(config.database);
app.set('superSecret', config.secret);


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, "we're connected!"));



//  create our router
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

        // if user is found and password is right
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











// set up specific route- for /books
router.route('/books')

// should create a book- POST  accessed at http://localhost:8080/api/books
    .post(upload.array(), function(req, res) {
        console.log(req.body);
        var book = new Book(); // creates new book model
        book.title = req.body.title;  //sets the book title Contains key-value pairs of data submitted in the request body. book.title = 
        
        book.author = req.body.author; //Contains key-value pairs of data submitted in the request body.
        console.log(book);
        book.save(function(err){
            if (err)
                res.send(err);

            res.json({ message: 'Book created'});
        });    
    })

// should GET all books - supposedly accessed at http://localhost:8080/api/books
    .get(function(req, res){
        Book.find(function(err, books){
            if (err)
                res.send(err);
            
            res.json(books);
        });
    })

router.route('/books/:book_id')
    .get(function(req, res){
        Book.findById(req.params.book_id, function(err, book){
            if (err)
                res.send(err);
            
            res.json(book);
        });
})  // NOTE: no semicolon!
    
    .put(function(req, res) { // starts put route - to update book title based on book ID
        Book.findById(req.params.book_id, function(err, book) { // sets up which book to be updated
            if (err) // establishes how to handle errors
                res.send(err);
            
            book.title = req.body.title;  // updates book title;
            
            book.author = req.body.author;
            book.save(function(err) {  // save new book title
                if (err)
                    res.send(err);
                
                res.json({ message: 'Book title updated' }); // let user know book title was updated
            });
            
    });
}) // NOTE: no semicolon!

    .delete(function(req, res){
        Book.remove({
            _id: req.params.book_id
        }, function(err, book) {
            if (err)
                res.send(err);
            
            res.json({ message: 'deleted' });
        });
});



// start routes - sets up initial extension in this case "/boooo/"- Nothing to do with mongoose dB.
app.use('/sun', router);
app.use('/sun', userRoutes);


// start server
app.listen(port);
console.log("Magic happening on port " + port);
    
    
    