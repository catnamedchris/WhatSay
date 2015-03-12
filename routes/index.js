var express = require('express');
var router = express.Router();
var FireBase = require('firebase');

var ref = new FireBase("https://scorching-fire-8079.firebaseio.com");






/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'WhatSay' });
});

router.get('/admin', function(req, res, next) {
  res.render('admin', { title: 'WhatSay - Admin' });
});


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});


router.post('/login', function(req,res, next){
	function authHandler(error, authData) {
	  if (error) {
	  	res.send('Error occured: ' + JSON.stringify(error));
	    console.log("Login Failed!", error);
	  } else {
	  	res.send('Authentication successfull');
	    console.log("Authenticated successfully with payload:", authData);
	  }
	}


	ref.authWithPassword({
		email: req.body.email,
		password: req.body.password
	}, authHandler);

	
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Login' });
});

module.exports = router;
