$(function() {
  var $textarea = $('#question');
  var $submitBtn = $('#btn-submit');
  var $waitMarker = $('#wait-marker');
  var $answerArea = $('#answer-area');
  var $answerContainer = $('#answer-container');
  var $answer = $('#answer');
  var $historyBtn = $('#btn-logs');
  var $logs = $('#logs');
  var $logCloseBtn = $('#logs .btn');

  var socket = io();
  var socketId;
  var logs = [];

  screen.orientation.lock('portrait');

  var storedLogs = localStorage.getItem('WhatSayLogs');
  if (storedLogs) {
    logs = JSON.parse(storedLogs);
  }

  socket.on('socketId', function(id) {
    socketId = id;
    console.log('socketId: ' + socketId);
  });

  socket.on('answer', function(data) {
    $answer.text(data.answer);
    logs.push({ time: data.time, text: data.answer, type: 'admin' });
    localStorage.setItem('WhatSayLogs', JSON.stringify(logs));

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

    var time = Date.now();
    socket.emit('question', { question: $textarea.val(), time: time });
    logs.push({ time: time, text: $textarea.val(), type: 'user' });

    $answerContainer.fadeTo('slow', 0).hide();
    $waitMarker.append(spinner.el);
    $waitMarker.show().fadeTo('slow', 1);
  });

  $historyBtn.on('click', function(event) {
    var $chat = $('#chat');
    $chat.html('');

    logs.forEach(function(entry) {
      var $chatEntryTemplate = $('#chat-entry');
      var $chatEntry =
        $($chatEntryTemplate
          .html()
          .replace('`userType`', entry.type))
        .html(entry.text);

      $chat.append($chatEntry);
    });

    $logs.show().animate({ top: 0, opacity: 1 });
  });

  $logCloseBtn.on('click', function(event) {
    $logs.animate({ top: '-100%', opacity: 0 });
  });
});
