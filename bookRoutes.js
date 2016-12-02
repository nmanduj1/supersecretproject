var express = require('express');
var multer = require('multer');
var upload = multer({ dest: './uploads/'});

var Book = require('./app/models/book');


module.exports = (function() {
    'use strict';
    var router = express.Router();
    
    // set up specific route- for /books
router.route('/books')

// should create a book- POST  accessed at http://localhost:8080/sun/books
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
    return router;

})();