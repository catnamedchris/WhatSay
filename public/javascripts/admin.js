window.onload = function() {
  var $questions = $('#questions');

  var socket = io();
  var socketId = null;

  socket.on('socketId', function(id) {
    socketId = id;

    socket.emit('adminConnected', socketId);
  });

  socket.on('question', function(questionData) {
    var $li = $('<li></li>');
    var $p = $('<p>' + questionData.question + '</p>');
    var $textarea = $('<textarea></textarea>');
    var $button = $('<button>Answer question</button>');

    $li.append($p);
    $li.append($textarea);
    $li.append($button);
    $questions.append($li);

    $button.on('click', function(event) {
      console.log($textarea.val());
      socket.emit('adminAnswer', questionData.socketId, $textarea.val());
    });
  });
};
