var express = require('express');
var router = express.Router();
var FireBase = require('firebase');

var myFirebaseRef = new FireBase('https://scorching-fire-8079.firebaseio.com/convo');

router.post('/', function(req, res){
	console.log(req.body);
	myFirebaseRef.push({
		incomingMessage: req.body.incomingMessage,
		socketIoID: req.body.sIo,
		answered : false,
		dateCreated: new Date().getTime(),
		userID: 'anonymous',
		answer: ''
	})
});


module.exports =  router;