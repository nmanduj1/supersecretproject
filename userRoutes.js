var express = require('express');
var User = require('./app/models/user');


module.exports = (function() {
 'use strict';
//var routes = require('express').Router();
var router = express.Router();   
    
    
// set up specific route- for /users
router.route('/users')

// should create a new user- POST  accessed at http://localhost:8080/api/users
    .post(function(req, res) {
        console.log(req.body);
        var user = new User(); // creates new user model
        user.firstName = req.body.firstName;  //sets the user name 
		//user
    	user.lastName = req.body.lastName;
        user.userName = req.body.userName;
		user.email = req.body.email;
		
        console.log(user);
        user.save(function(err){
            if (err)
                res.send(err);

            res.json({ message: 'User created'});
        });    
    })

// should GET all users - accessed at http://localhost:8080/api/users
    .get(function(req, res){
        User.find(function(err, users){
            if (err)
                res.send(err);
            
            res.json(users);
        });
    })

router.route('/users/:user_id')
    .get(function(req, res){
        User.findById(req.params.user_id, function(err, user){
            if (err)
                res.send(err);
            
            res.json(user);
        });
})  
    .put(function(req, res) { // starts put route - to update user deets using specific user ID
       User.findById(req.params.user_id, function(err, user) { // sets up which user will be updated
            if (err) // establishes how to handle errors
                res.send(err);
            
            user.firstName = req.body.firstName;  //sets the user name 
		    user.lastName = req.body.lastName;
		    user.userName = req.body.userName;
			user.email = req.body.email;
				
            user.save(function(err) {  // save updated user info
                if (err)
                    res.send(err);
                
                res.json({ message: 'User deets updated' }); // let user know their updates were saved
            });
            
    });
}) // NOTE: no semicolon!

    .delete(function(req, res){
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);
            
            res.json({ message: 'buh bye user' });
        });
});
    return router;

})();