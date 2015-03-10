$(function() {
  var $textarea = $('#question');
  var $submitBtn = $('#btn-submit');
  var $waitMarker = $('#wait-marker');
  var $answerArea = $('#answer-area');
  var $answerContainer = $('#answer-container');
  var $answer = $('#answer');

  var socket = io();

  screen.orientation.lock('portrait');

  socket.on('answer', function(answer) {
    $answer.text(answer);

    $waitMarker.fadeTo('slow', 0).hide();
    $answerContainer.show().fadeTo('slow', 1);
  });

  $submitBtn.on('click', function(event) {
    var opts = {
      lines: 12, // The number of lines to draw
      length: 15, // The length of each line
      width: 8, // The line thickness
      radius: 20, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#fff', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '50%', // Top position relative to parent
      left: '50%' // Left position relative to parent
    };
    var spinner = new Spinner(opts).spin();

    socket.emit('question', $textarea.val());

    $answerContainer.fadeTo('slow', 0).hide();
    $waitMarker.append(spinner.el);
    $waitMarker.show().fadeTo('slow', 1);
  });
});
