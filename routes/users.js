var express = require('express');
var router = express.Router();
var FireBase = require('firebase');

var ref = new FireBase("https://scorching-fire-8079.firebaseio.com");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', function(req, res, next) {
	//connect to user database
	//check if user exist
		//if user does exist return user exist
		//else create account and return success
	ref.createUser({
  	email    : req.body.email,
  	password : req.body.password 
	}, function(error, userData) {
  	if (error) {
  		res.send('Sorry there was an error: ' + JSON.stringify(error));
    	console.log("Error creating user:", error);
  	} else {
  		res.send('Successfully created user ' + req.body.email);
  	  console.log("Successfully created user account with uid:", userData.uid);
  	}
	});
});


module.exports = router;
