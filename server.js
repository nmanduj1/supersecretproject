

// first, we need to call the packages we need.
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Book = require('./app/models/book');


// configure body parser - middleware parsers.  ASK MARK.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// set up our port- the mumbo jumbo is fancy stuff telling the app to use whatever port is available or 8080;
var port = process.env.PORT || 8080;


// connect our database (also see var mongoose and var book called ^^ at the start.  they also set up our DB)
mongoose.connect('mongodb://localhost:27017/api');
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




// set up specific route- for /books
router.route('/books')

// should create a book- POST supposedly accessed at http://localhost:8080/api/books
    .post(function(req, res) {
    
        var book = new Book(); // creates new book model
        book.title = req.body.title;  // sets the book title Contains key-value pairs of data submitted in the request body.
        book.author = req.body.author; //Contains key-value pairs of data submitted in the request body.
    
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


// start routes- i think.
app.use('/api', router);


// start server
app.listen(port);
console.log("Magic happening on port " + port);