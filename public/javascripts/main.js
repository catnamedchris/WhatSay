window.onload = function() {
  var textarea = document.getElementById('question');
  var submitBtn = document.getElementById('btn-submit');
  var $answer = $('#answer');

  var socket = io();
  var socketId = null;

  socket.on('socketId', function(id) {
    console.log('socketId: ' + id);
    socketId = id;
  });

  socket.on('answer', function(answer) {
    $answer.text(answer);
    $answer.show();
  });

  submitBtn.onclick = function(event) {
    socket.emit('question', textarea.value);
  };

};
