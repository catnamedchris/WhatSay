$(function() {
	var ref = new FireBase("https://scorching-fire-8079.firebaseio.com");
	var $inputEmail = $('#inputEmail');
	var $inputPassword = $('#inputPassword');
	$('#button-login').on('click', function() {

		function authHandler(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				location.href = '/';
				console.log("Authenticated successfully with payload:", authData);
			}
		}

		ref.authWithPassword({
			email: $inputEmail.val(),
			password: $inputPassword.val()
		}, authHandler);
	});
});