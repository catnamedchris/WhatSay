$(function() {
  var socket = io();
  var adminSocketId = null;
  var logs = {};
  var currentSocketId = null;

  var $socketIdMenu = $('#users');
  var $textarea = $('#admin-answer');
  var $answerBtn = $('#log button');

  function renderLog(socketId) {
    var $chat = $('#chat');
    $chat.html('');

    $('li[data-id="' + socketId + '"]')
      .addClass('active')
      .siblings()
      .removeClass('active');

    logs[socketId].forEach(function(entry) {
      var $chatEntryTemplate = $('#chat-entry');
      var $chatEntry =
        $($chatEntryTemplate
          .html()
          .replace('`userType`', entry.type))
        .html(entry.text);

      $chat.append($chatEntry);
    });
  }

  socket.on('socketId', function(id) {
    adminSocketId = id;

    socket.emit('adminConnected', adminSocketId);
  });

  socket.on('question', function(questionData) {
    currentSocketId = questionData.socketId;

    var $userMenuItemTemplate = $('#user-menu-item');
    var $userMenuItem;

    if (currentSocketId in logs) {
      $('li[data-id="' + currentSocketId + '"]')
        .addClass('has-new-data')
        .addClass('active')
        .siblings()
        .removeClass('active');

      logs[currentSocketId].push({ text: questionData.question, type: 'user' });
    } else {
      $userMenuItem =
        $($userMenuItemTemplate
          .html()
          .replace(/`socketId`/g, currentSocketId));

      $('#users').append($userMenuItem);

      $userMenuItem
        .addClass('has-new-data')
        .addClass('active')
        .siblings()
        .removeClass('active');

      logs[currentSocketId] = [{ text: questionData.question, type: 'user' }];
    }

    renderLog(currentSocketId);
  });

  socket.on('userDisconnected', function(id) {
    console.log('userDisconnected: ' + id);
    if (id in logs) {
      $('li[data-id="' + id + '"').css('background-color', 'rgba(255, 0, 0, 0.1)');
      logs[id].push({ text: 'USER DISCONNECTED', type: 'system' });
      renderLog(id);
    }
  });

  $socketIdMenu.on('click', 'li', function(event) {
    currentSocketId = $(event.currentTarget).attr('data-id');
    renderLog(currentSocketId);
  });

  $answerBtn.on('click', function(event) {
    if (currentSocketId) {
      logs[currentSocketId].push({ text: $textarea.val(), type: 'admin' });
      $('li[data-id="' + currentSocketId + '"').removeClass('has-new-data');
      renderLog(currentSocketId);
      socket.emit('adminAnswer', currentSocketId, $textarea.val());
      $textarea.val('');
    }
  })
});
